// Usage:
// <FilterBar
//   filters={[
//     { key: 'dateFrom', type: 'date', label: 'From' },
//     { key: 'dateTo', type: 'date', label: 'To' },
//     { key: 'department', type: 'select', label: 'Department', options: ['All', 'Sales', 'HR'] },
//   ]}
//   values={filterValues}
//   onChange={(key, value) => setFilterValues((v) => ({ ...v, [key]: value }))}
// />
function FilterBar({ filters, values, onChange }) {
  return (
    <div className="ent-filterbar">
      {filters.map((f) => {
        if (f.type === 'select') {
          return (
            <select
              key={f.key}
              value={values[f.key] ?? 'All'}
              onChange={(e) => onChange(f.key, e.target.value)}
              aria-label={f.label}
            >
              {f.label && <option value="" disabled>{f.label}</option>}
              {f.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          );
        }

        if (f.type === 'date') {
          return (
            <input
              key={f.key}
              type="date"
              value={values[f.key] ?? ''}
              onChange={(e) => onChange(f.key, e.target.value)}
              aria-label={f.label}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

export default FilterBar;