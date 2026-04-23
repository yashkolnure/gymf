const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/super-admin';

const req = async (method, path, body, token) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data;
};

export const superAdminAPI = {
  // Auth
  login: (email, password) => fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(r => r.json()),

  // Dashboard
  getDashboard: (token) => req('GET', '/dashboard', null, token),

  // Gyms
  getGyms: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return req('GET', `/gyms?${qs}`, null, token);
  },
  getGym: (token, id) => req('GET', `/gyms/${id}`, null, token),

  // Subscription actions
  assignPlan:        (token, id, body)  => req('POST',  `/gyms/${id}/assign-plan`, body, token),
  extendSubscription:(token, id, body)  => req('POST',  `/gyms/${id}/extend`,      body, token),
  suspendGym:        (token, id, body)  => req('POST',  `/gyms/${id}/suspend`,     body, token),
  activateGym:       (token, id)        => req('POST',  `/gyms/${id}/activate`,    null, token),
  updateLimits:      (token, id, body)  => req('PATCH', `/gyms/${id}/limits`,      body, token),
  updateModules:     (token, id, body)  => req('PATCH', `/gyms/${id}/modules`,     body, token),

  // Plan templates
  getPlans:   (token)        => req('GET', '/plans',            null, token),
  updatePlan: (token, name, body) => req('PUT', `/plans/${name}`, body, token),
};
