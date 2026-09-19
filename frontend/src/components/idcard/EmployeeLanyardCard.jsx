import { QRCodeSVG } from 'qrcode.react';
import { resolveUploadUrl } from '../../utils/url';
import { accessLevelLabel } from './IdCardStatusBadge';

const CARD_WIDTH = 234;
const CARD_HEIGHT = 410;
const HOLE_DIAMETER = 10;

const DEFAULT_CARD_COLOR = '#7C3AED';

function initials(fn = '', ln = '') {
  return `${fn[0] || ''}${ln[0] || ''}`.toUpperCase();
}

// Screen-only lanyard cord illustration — hidden on print via the `no-print` class,
// since the real cord is a physical clip attached after printing, not part of the card.
function LanyardCordPreview({ color }) {
  const cx = CARD_WIDTH / 2;
  return (
    <svg
      className="no-print"
      width={CARD_WIDTH}
      height="56"
      viewBox={`0 0 ${CARD_WIDTH} 56`}
      style={{ display: 'block', marginBottom: -8 }} // pulls the clip snug against the card's top edge
      aria-hidden="true"
    >
      {/* Two straps converging to a neckband, meeting at the clip */}
      <path d={`M ${cx - 55} 0 L ${cx - 6} 32`} stroke={color} strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d={`M ${cx + 55} 0 L ${cx + 6} 32`} stroke={color} strokeWidth="14" fill="none" strokeLinecap="round" />
      {/* Metal clip connecting the cord to the card's punch hole — stands in for the hole on screen */}
      <rect x={cx - 9} y="28" width="18" height="20" rx="4" fill="#cbd5e1" stroke="#94a3b8" />
      <circle cx={cx} cy="48" r="4" fill="#e2e8f0" stroke="#94a3b8" />
    </svg>
  );
}

function EmployeeLanyardCard({ employee, card, companyLogo, className = '' }) {
  if (!employee) return null;

  const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
  const photo = employee.photoUrl ? resolveUploadUrl(employee.photoUrl) : null;
  const qrValue = employee.employeeCode || String(employee.id);
  const roleColor = card?.roleColor || DEFAULT_CARD_COLOR;

  return (
    <div className="flex flex-col items-center">
      <LanyardCordPreview color={roleColor} />

      <div
        className={`ent-id-card relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm ${className}`}
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT, marginTop: -6 }}
      >
        {/* Real punch hole — only rendered when actually printing; the cord's clip stands in for it on screen */}
        <div
          className="print-only mt-2 shrink-0 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800"
          style={{ width: HOLE_DIAMETER, height: HOLE_DIAMETER }}
          aria-hidden="true"
        />

        {/* Colored role band — same logo for every role */}
        <div
          className="mt-2 flex w-full flex-col items-center gap-1 px-3 py-3 text-white"
          style={{ backgroundColor: roleColor }}
        >
          {companyLogo ? (
            <img src={companyLogo} alt="Logo" className="h-8 w-8 rounded object-contain bg-white" />
          ) : null}
          <div className="truncate text-center text-[11px] font-bold tracking-wide">
            {employee.companyName || 'Company'}
          </div>
        </div>

        {/* Photo */}
        <div
          className="mt-3 flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-full text-2xl font-bold"
          style={{ backgroundColor: `${roleColor}1A` }}
        >
          {photo ? (
            <img src={photo} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <span style={{ color: roleColor }}>{initials(employee.firstName, employee.lastName)}</span>
          )}
        </div>

        {/* Name & role */}
        <div className="mt-2 px-2 text-center">
          <div className="truncate text-[15px] font-bold leading-tight text-slate-900 dark:text-slate-100">
            {fullName || '—'}
          </div>
          <div className="mt-0.5 truncate text-[11px] font-semibold" style={{ color: roleColor }}>
            {employee.positionName || '—'}
          </div>
          <div className="mt-1 truncate text-[10.5px] text-slate-500 dark:text-slate-400">
            {employee.departmentName || '—'}
          </div>
          <div className="mt-1 truncate text-[10px] text-slate-400 dark:text-slate-500">
            ID: {employee.employeeCode || '—'}
          </div>
        </div>

        {/* QR code */}
        <div className="mt-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white p-1">
          <QRCodeSVG value={qrValue} size={64} />
        </div>

        {/* Access level footer, pinned to the bottom */}
        {card ? (
          <div className="mt-auto w-full border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-2 py-1.5 text-center text-[9.5px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {accessLevelLabel(card.accessLevel)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default EmployeeLanyardCard;
export { CARD_WIDTH, CARD_HEIGHT };