const STATUS_STYLES = {
  ACTIVE: { className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Active' },
  LOST: { className: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', label: 'Lost' },
  EXPIRED: { className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Expired' },
  REISSUED: { className: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400', label: 'Reissued' },
};

const ACCESS_LABELS = {
  EMPLOYEE_ACCESS: 'Employee Access',
  STAFF_ACCESS: 'Staff Access',
  AUTHORIZED_ACCESS: 'Authorized Access',
  RESTRICTED_ACCESS: 'Restricted Access',
};


function IdCardStatusBadge({ status, className = '' }) {
  const s = STATUS_STYLES[status] || {
    className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    label: status || 'Unknown',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${s.className} ${className}`}
    >
      {s.label}
    </span>
  );
}

export function accessLevelLabel(accessLevel) {
  return ACCESS_LABELS[accessLevel] || accessLevel || '—';
}

export default IdCardStatusBadge;
export { STATUS_STYLES, ACCESS_LABELS };