import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Loader2, Search, Check, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`modal ${sizes[size]} w-full`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="section-title">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-surface-border flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', trend, trendLabel, loading }) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  if (loading) return (
    <div className="stat-card">
      <div className="shimmer-line h-4 w-24 mb-4" />
      <div className="shimmer-line h-8 w-16 mb-2" />
      <div className="shimmer-line h-3 w-20" />
    </div>
  );

  return (
    <div className="stat-card group hover:border-white/10 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </p>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      {trendLabel && <p className="text-xs text-gray-500 mt-1">{trendLabel}</p>}
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
export function Table({ columns, data, loading, emptyMessage = 'No data found', onRowClick }) {
  if (loading) return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="shimmer-line h-12 w-full" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-border">
            {columns.map((col) => (
              <th key={col.key} className={`table-header ${col.className || ''}`}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-12 text-gray-500 text-sm">{emptyMessage}</td></tr>
          ) : (
            data?.map((row, i) => (
              <tr key={row._id || i} className={`table-row ${onRowClick ? 'cursor-pointer' : ''}`} onClick={() => onRowClick?.(row)}>
                {columns.map((col) => (
                  <td key={col.key} className={`table-cell ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({ pagination, onChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total, limit } = pagination;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border">
      <p className="text-xs text-gray-500">
        Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
      </p>
      <div className="flex gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page <= 1} className="px-3 py-1.5 text-xs btn-ghost disabled:opacity-30">Prev</button>
        {[...Array(Math.min(pages, 7))].map((_, i) => {
          const p = i + 1;
          return <button key={p} onClick={() => onChange(p)} className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors ${page === p ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{p}</button>;
        })}
        <button onClick={() => onChange(page + 1)} disabled={page >= pages} className="px-3 py-1.5 text-xs btn-ghost disabled:opacity-30">Next</button>
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    active: 'badge-green', expired: 'badge-red', frozen: 'badge-blue',
    pending: 'badge-yellow', cancelled: 'badge-gray', inactive: 'badge-gray',
    paid: 'badge-green', partial: 'badge-yellow', overdue: 'badge-red',
    new: 'badge-blue', converted: 'badge-green', lost: 'badge-red',
    follow_up: 'badge-yellow', trial_scheduled: 'badge-orange', trial_done: 'badge-orange',
    contacted: 'badge-blue', negotiation: 'badge-orange',
  };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status?.replace(/_/g, ' ')}</span>;
}

// ─── Input Field ─────────────────────────────────────────────────────────────
export function FormField({ label, error, required, children, hint }) {
  return (
    <div className="form-group">
      {label && <label className="label">{label}{required && <span className="text-primary ml-0.5">*</span>}</label>}
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400 mt-1">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ value, onChange, options, placeholder = 'Select...', className = '' }) {
  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`input appearance-none pr-8 ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={danger ? 'btn-danger' : 'btn-primary'}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-gray-300 text-sm">{message}</p>
    </Modal>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-primary ${className}`} />;
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-600" />
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative flex-1 min-w-0">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9"
      />
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ name, photo, size = 'md' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
  const colors = ['bg-primary/20 text-primary', 'bg-blue-500/20 text-blue-400', 'bg-emerald-500/20 text-emerald-400', 'bg-violet-500/20 text-violet-400', 'bg-amber-500/20 text-amber-400'];
  const colorIdx = name ? name.charCodeAt(0) % colors.length : 0;

  if (photo) return <img src={photo} alt={name} className={`${sizes[size]} rounded-full object-cover`} />;
  return (
    <div className={`${sizes[size]} ${colors[colorIdx]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions, breadcrumb }) {
  return (
    <div className="page-header">
      <div>
        {breadcrumb && <p className="text-xs text-gray-500 mb-1">{breadcrumb}</p>}
        <h1 className="font-display text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', title, action, noPadding }) {
  return (
    <div className={`card ${noPadding ? '' : 'p-5'} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="section-title">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-surface-card/50 p-1 rounded-xl border border-surface-border w-fit">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${active === tab.value ? 'bg-primary text-white shadow-md shadow-primary/25' : 'text-gray-400 hover:text-white'}`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${active === tab.value ? 'bg-white/20' : 'bg-surface-card'}`}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
