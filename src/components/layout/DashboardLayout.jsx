import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { notificationAPI } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, Users, ClipboardCheck, TrendingUp, UserCog,
  CreditCard, Package, Settings, ChevronLeft, Bell, LogOut,
  Building2, BarChart3, Dumbbell, Menu, X, Search,
  ChevronRight, Shield
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-400' },
  { path: '/members', icon: Users, label: 'Members', color: 'text-emerald-400' },
  { path: '/attendance', icon: ClipboardCheck, label: 'Attendance', color: 'text-violet-400' },
  { path: '/leads', icon: TrendingUp, label: 'Leads & CRM', color: 'text-amber-400' },
  { path: '/staff', icon: UserCog, label: 'Staff', color: 'text-pink-400' },
  { path: '/plans', icon: Dumbbell, label: 'Plans', color: 'text-cyan-400' },
  { path: '/payments', icon: CreditCard, label: 'Payments', color: 'text-green-400' },
  { path: '/branches', icon: Building2, label: 'Branches', color: 'text-orange-400' },
  { path: '/inventory', icon: Package, label: 'Inventory', color: 'text-red-400' },
  { path: '/reports', icon: BarChart3, label: 'Reports', color: 'text-indigo-400' },
  { path: '/audit-logs', icon: Shield, label: 'Audit Logs', color: 'text-rose-400', roles: ['gym_owner'] },
  { path: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-400' },
];

const getRoleColor = (role) => {
  const colors = { gym_owner: 'bg-primary/20 text-primary', branch_manager: 'bg-blue-500/20 text-blue-400', receptionist: 'bg-violet-500/20 text-violet-400', trainer: 'bg-emerald-500/20 text-emerald-400' };
  return colors[role] || 'bg-gray-500/20 text-gray-400';
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, tenant, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: notifData } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: () => notificationAPI.getUnreadCount(),
    refetchInterval: 60000,
  });
  const unreadCount = notifData?.data?.count || 0;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const currentPage = navItems.find(i => location.pathname.startsWith(i.path))?.label || 'Dashboard';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-surface-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
          <Dumbbell size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display font-bold text-base text-white leading-none truncate">{tenant?.gymName || 'GymPro'}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">Management Portal</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {navItems.filter(item => !item.roles || item.roles.includes(user?.role)).map(({ path, icon: Icon, label, color }) => {
          const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
          return (
            <NavLink key={path} to={path}>
              <div className={`${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'} ${collapsed ? 'justify-center px-2' : ''}`} title={collapsed ? label : ''}>
                <Icon size={18} className={isActive ? 'text-white' : color} />
                {!collapsed && <span className="text-sm">{label}</span>}
                {!collapsed && isActive && <ChevronRight size={14} className="ml-auto opacity-70" />}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* User Card */}
      <div className={`p-3 border-t border-surface-border`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-card/50 group">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${getRoleColor(user?.role)}`}>
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
            <button onClick={handleLogout} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400 p-1 rounded" title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} className="w-full flex justify-center p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
            <LogOut size={17} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0F0F1A] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col ${collapsed ? 'w-16' : 'w-60'} bg-[#0d0d1a] border-r border-surface-border transition-all duration-300 flex-shrink-0 relative`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-card border border-surface-border flex items-center justify-center z-10 hover:bg-primary/20 hover:border-primary/40 transition-all"
        >
          <ChevronLeft size={12} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#0d0d1a] border-r border-surface-border z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-surface-border bg-[#0d0d1a]/80 backdrop-blur-sm flex items-center px-4 gap-4 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-white font-medium">{currentPage}</span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-surface-card border border-surface-border rounded-lg px-3 py-1.5 w-56 group focus-within:border-primary/40 transition-colors">
            <Search size={14} className="text-gray-500 group-focus-within:text-primary transition-colors" />
            <input placeholder="Quick search..." className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full" />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary cursor-pointer">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 bg-mesh">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
