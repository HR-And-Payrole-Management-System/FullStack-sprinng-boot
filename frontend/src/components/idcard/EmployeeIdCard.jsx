import { QRCodeSVG } from 'qrcode.react';
import { resolveUploadUrl } from '../../utils/url';
import IdCardStatusBadge, { accessLevelLabel } from './IdCardStatusBadge';

// Standard CR-80 badge ratio (3.375in x 2.125in) scaled up for screen legibility.
const CARD_WIDTH = 338;
const CARD_HEIGHT = 234;

// Used when there's no card yet (quick preview) or the employee has no role assigned.
const DEFAULT_CARD_COLOR = '#7C3AED'; // Tailwind violet-600, matches the old hardcoded header

function initials(fn = '', ln = '') {
  return `${fn[0] || ''}${ln[0] || ''}`.toUpperCase();
}

function EmployeeIdCard({ employee, card, companyLogo, className = '' }) {
  if (!employee) return null;

  const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
  const photo = employee.photoUrl ? resolveUploadUrl(employee.photoUrl) : null;
  const qrValue = employee.employeeCode || String(employee.id);
  const roleColor = card?.roleColor || DEFAULT_CARD_COLOR;

  return (
    <div
      className={`ent-id-card relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm ${className}`}
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      {card ? (
        <IdCardStatusBadge status={card.status} className="absolute right-2 top-2 z-10 shadow-sm" />
      ) : null}

      {/* Header — colored by the employee's role (Admin/HR/Employee...), logo stays the same for everyone */}
      <div
        className="flex items-center gap-2 px-3 py-2 text-white"
        style={{ backgroundColor: roleColor }}
      >
        {companyLogo ? (
          <img
            src={companyLogo}
            alt="Logo"
            className="h-5 w-5 shrink-0 rounded object-contain bg-white"
          />
        ) : null}
        <div className="truncate text-xs font-bold tracking-wide">
          {employee.companyName || 'Company'}
        </div>
        {!card && (
          <div className="ml-auto shrink-0 text-[9px] font-semibold opacity-85">EMPLOYEE ID</div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 gap-3 px-3 py-2.5">
        <div
          className="flex h-[82px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-lg text-xl font-bold"
          style={{ backgroundColor: `${roleColor}1A` }} // ~10% tint of the role color
        >
          {photo ? (
            <img src={photo} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <span style={{ color: roleColor }}>{initials(employee.firstName, employee.lastName)}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-bold leading-tight text-slate-900 dark:text-slate-100">
            {fullName || '—'}
          </div>
          <div className="mt-0.5 truncate text-[11px] font-semibold" style={{ color: roleColor }}>
            {employee.positionName || '—'}
          </div>
          <div className="mt-1.5 truncate text-[10.5px] text-slate-500 dark:text-slate-400">
            {employee.departmentName || '—'}
          </div>
          {employee.branchName ? (
            <div className="truncate text-[10.5px] text-slate-500 dark:text-slate-400">{employee.branchName}</div>
          ) : null}
          <div className="mt-1.5 truncate text-[10.5px] text-slate-400 dark:text-slate-500">
            ID: {employee.employeeCode || '—'}
          </div>
        </div>

        <div className="flex shrink-0 items-end">
          <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-white p-1">
            <QRCodeSVG value={qrValue} size={54} />
          </div>
        </div>
      </div>

      {/* Access level footer */}
      {card ? (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {accessLevelLabel(card.accessLevel)}
        </div>
      ) : null}
    </div>
  );
}

export default EmployeeIdCard;
export { CARD_WIDTH, CARD_HEIGHT };