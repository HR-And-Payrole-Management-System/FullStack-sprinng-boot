const DATE_RANGES = ['Jan 2023 - Dec 2023', 'This Month', 'Last 3 Months', 'This Year', 'Last Year'];

function Chip({ icon, label, value, options, onChange }) {
  return (
    <div className="ent-filter-chip">
      <div className="ent-filter-chip-label">{icon} {label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <span className="ent-filter-chip-chevron">▾</span>
    </div>
  );
}

function DashboardFilterBar({ values, onChange, departmentOptions = ['All'], jobRoleOptions = ['All'], locationOptions = ['All'], onOpenFilters }) {
  return (
    <div className="ent-filter-row">
      <Chip icon="📅" label="Date Range" value={values.dateRange} options={DATE_RANGES} onChange={(v) => onChange('dateRange', v)} />
      <Chip icon="" label="Department" value={values.department} options={departmentOptions} onChange={(v) => onChange('department', v)} />
      <Chip icon="" label="Job Role" value={values.jobRole} options={jobRoleOptions} onChange={(v) => onChange('jobRole', v)} />
      <Chip icon="" label="Location" value={values.location} options={locationOptions} onChange={(v) => onChange('location', v)} />
      <button type="button" className="ent-filter-btn" onClick={onOpenFilters}>
        ⏚ Filters
      </button>
    </div>
  );
}

export default DashboardFilterBar;