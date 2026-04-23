import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors + token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.response?.data?.code === 'TOKEN_EXPIRED') {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }).catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { token, refreshToken: newRefresh } = res.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefresh);
          processQueue(null, token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      localStorage.clear();
      window.location.href = '/login';
    }

    // Show error toast for non-auth errors
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status !== 401 && error.response?.status !== 404) {
      toast.error(message);
    }

    return Promise.reject(error.response?.data || error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
  getRevenueTrend: (months = 12) => api.get(`/dashboard/revenue-trend?months=${months}`),
  getAttendanceTrend: (days = 30) => api.get(`/dashboard/attendance-trend?days=${days}`),
  getPlanDistribution: () => api.get('/dashboard/plan-distribution'),
  getLeadFunnel: () => api.get('/dashboard/lead-funnel'),
  getActivity: (limit = 20) => api.get(`/dashboard/activity?limit=${limit}`),
  getTopMembers: () => api.get('/dashboard/top-members'),
};

// ─── Members ─────────────────────────────────────────────────────────────────
export const memberAPI = {
  getAll: (params) => api.get('/members', { params }),
  getOne: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
  renew: (id, data) => api.post(`/members/${id}/renew`, data),
  freeze: (id, data) => api.post(`/members/${id}/freeze`, data),
  addNote: (id, text) => api.post(`/members/${id}/notes`, { text }),
  getQR: (id) => api.get(`/members/${id}/qr`),
  getStats: () => api.get('/members/stats'),
};

// ─── Attendance ───────────────────────────────────────────────────────────────
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  getLive: () => api.get('/attendance/live'),
  qrCheckIn: (qrData) => api.post('/attendance/checkin/qr', { qrData }),
  manualCheckIn: (data) => api.post('/attendance/checkin/manual', data),
  checkOut: (id) => api.put(`/attendance/${id}/checkout`),
  markStaff: (data) => api.post('/attendance/staff', data),
  getMemberMonthly: (id, month) => api.get(`/attendance/member/${id}/monthly`, { params: { month } }),
};

// ─── Leads ───────────────────────────────────────────────────────────────────
export const leadAPI = {
  getAll: (params) => api.get('/leads', { params }),
  getPipeline: () => api.get('/leads/pipeline'),
  getStats: () => api.get('/leads/stats'),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  updateStage: (id, stage, data) => api.put(`/leads/${id}/stage`, { stage, ...data }),
  addFollowUp: (id, data) => api.post(`/leads/${id}/followup`, data),
  convert: (id, data) => api.post(`/leads/${id}/convert`, data),
};

// ─── Staff ───────────────────────────────────────────────────────────────────
export const staffAPI = {
  getAll: (params) => api.get('/staff', { params }),
  getOne: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
  getAttendanceSummary: (month) => api.get('/staff/attendance/summary', { params: { month } }),
  getPermissions: () => api.get('/staff/permissions'),
};

// ─── Plans ───────────────────────────────────────────────────────────────────
export const planAPI = {
  getAll: (params) => api.get('/plans', { params }),
  create: (data) => api.post('/plans', data),
  update: (id, data) => api.put(`/plans/${id}`, data),
  delete: (id) => api.delete(`/plans/${id}`),
};

// ─── Payments ────────────────────────────────────────────────────────────────
export const paymentAPI = {
  getAll: (params) => api.get('/payments', { params }),
  create: (data) => api.post('/payments', data),
  getSummary: (params) => api.get('/payments/summary', { params }),
};

// ─── Branches ────────────────────────────────────────────────────────────────
export const branchAPI = {
  getAll: () => api.get('/branches'),
  create: (data) => api.post('/branches', data),
  update: (id, data) => api.put(`/branches/${id}`, data),
};

// ─── Tenant ───────────────────────────────────────────────────────────────────
export const tenantAPI = {
  getMy: () => api.get('/tenant/my'),
  updateSettings: (data) => api.put('/tenant/settings', data),
  updateGymInfo: (data) => api.put('/tenant/gym-info', data),
};

// ─── Trainers ────────────────────────────────────────────────────────────────
export const trainerAPI = {
  getAll: () => api.get('/trainers'),
  getMembers: (id) => api.get(`/trainers/${id}/members`),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reportAPI = {
  getMembers: (params) => api.get('/reports/members', { params }),
  getRevenue: (params) => api.get('/reports/revenue', { params }),
  getAuditLogs: (params) => api.get('/reports/audit-logs', { params }),
  getAuditSummary: () => api.get('/reports/audit-logs/summary'),
};

// ─── Inventory ───────────────────────────────────────────────────────────────
export const inventoryAPI = {
  getAll: (params) => api.get('/inventory', { params }),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  sell: (id, data) => api.post(`/inventory/${id}/sell`, data),
};

export default api;
