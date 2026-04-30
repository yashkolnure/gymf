import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './context/authStore';
import { useSuperAdminStore } from './context/superAdminStore';

// Landing Pages
import LandingPage from './pages/landing/LandingPage';
import FeaturesPage from './pages/landing/FeaturesPage';
import DocsPage from './pages/landing/DocsPage';
import SupportPage from './pages/landing/SupportPage';
import ContactPage from './pages/landing/ContactPage';
import PrivacyPage from './pages/landing/PrivacyPage';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import SuperAdminLayout from './components/layout/SuperAdminLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Super Admin
import SuperAdminLoginPage from './pages/superadmin/SuperAdminLoginPage';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import GymsListPage from './pages/superadmin/GymsListPage';
import GymDetailPage from './pages/superadmin/GymDetailPage';
import PlanTemplatesPage from './pages/superadmin/PlanTemplatesPage';

// Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

// Members
import MembersPage from './pages/members/MembersPage';
import MemberDetailPage from './pages/members/MemberDetailPage';
import AddMemberPage from './pages/members/AddMemberPage';

// Attendance
import AttendancePage from './pages/attendance/AttendancePage';

// Leads
import LeadsPage from './pages/leads/LeadsPage';

// Staff
import StaffPage from './pages/staff/StaffPage';

// Plans
import PlansPage from './pages/plans/PlansPage';

// Payments
import PaymentsPage from './pages/payments/PaymentsPage';

// Reports
import ReportsPage from './pages/reports/ReportsPage';
import AuditLogPage from './pages/reports/AuditLogPage';

// Settings
import SettingsPage from './pages/settings/SettingsPage';

// Branches
import BranchesPage from './pages/branches/BranchesPage';

// Inventory
import InventoryPage from './pages/inventory/InventoryPage';

// --- Route Guards ---

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // If user doesn't have the required role, send them to their main dashboard
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  // If logged in, prevent access to Login/Register and send to Dashboard
  return isAuthenticated ? <Navigate to="/app/dashboard" replace /> : children;
};

const SuperAdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSuperAdminStore();
  return isAuthenticated ? children : <Navigate to="/super-admin/login" replace />;
};

const SuperAdminPublicRoute = ({ children }) => {
  const { isAuthenticated } = useSuperAdminStore();
  return isAuthenticated ? <Navigate to="/super-admin/dashboard" replace /> : children;
};

export default function App() {
  const { isAuthenticated, fetchMe, token } = useAuthStore();

  useEffect(() => {
    if (token && isAuthenticated) {
      fetchMe();
    }
  }, [token, isAuthenticated, fetchMe]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Super Admin ──────────────────────────────────────────────── */}
        <Route path="/super-admin/login" element={<SuperAdminPublicRoute><SuperAdminLoginPage /></SuperAdminPublicRoute>} />
        
        <Route path="/super-admin" element={<SuperAdminProtectedRoute><SuperAdminLayout /></SuperAdminProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="gyms"      element={<GymsListPage />} />
          <Route path="gyms/:id"  element={<GymDetailPage />} />
          <Route path="plans"     element={<PlanTemplatesPage />} />
        </Route>

        {/* ── Public Landing Pages ─────────────────────────────────────── */}
        {/* These do NOT use PublicRoute because we want them accessible even if logged in */}
        <Route path="/"           element={<LandingPage />} />
        <Route path="/features"   element={<FeaturesPage />} />
        <Route path="/docs"       element={<DocsPage />} />
        <Route path="/support"    element={<SupportPage />} />
        <Route path="/contact"    element={<ContactPage />} />
        <Route path="/privacy"    element={<PrivacyPage />} />

        {/* ── Gym App Auth ─────────────────────────────────────────────── */}
        <Route path="/login"           element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register"        element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

        {/* ── Gym App Dashboard (Standardized to /app) ─────────────────── */}
        <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<DashboardPage />} />
          <Route path="members"      element={<MembersPage />} />
          <Route path="members/add"  element={<AddMemberPage />} />
          <Route path="members/:id"  element={<MemberDetailPage />} />
          <Route path="attendance"   element={<AttendancePage />} />
          <Route path="leads"        element={<LeadsPage />} />
          <Route path="staff"        element={<StaffPage />} />
          <Route path="plans"        element={<PlansPage />} />
          <Route path="payments"     element={<PaymentsPage />} />
          <Route path="reports"      element={<ReportsPage />} />
          <Route path="audit-logs"   element={<AuditLogPage />} />
          <Route path="branches"     element={<BranchesPage />} />
          <Route path="inventory"    element={<InventoryPage />} />
          <Route path="settings"     element={<SettingsPage />} />
        </Route>

        {/* ── Redirects & Fallbacks ────────────────────────────────────── */}
        {/* Redirect old /dashboard links to the new /app/dashboard */}
        <Route path="/dashboard/*" element={<Navigate to="/app/dashboard" replace />} />
        
        {/* Global Catch-all: Send unknown routes back to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}