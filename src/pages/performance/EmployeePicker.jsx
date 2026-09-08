import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { employeeApi } from '../../api/employee.api';

function EmployeePicker({ value, onSelect }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!keyword.trim()) { setResults([]); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      employeeApi
        .getAll({ page: 0, size: 8, keyword })
        .then((res) => setResults(res.data?.data?.content || res.data?.content || []))
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timer.current);
  }, [keyword]);

  return (
    <div className="position-relative" style={{ maxWidth: 320 }}>
      <Form.Control
        placeholder="Search employee by name or code..."
        value={value ? `${value.employeeCode} — ${value.firstName} ${value.lastName}` : keyword}
        onChange={(e) => { onSelect(null); setKeyword(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <div
          className="ent-card position-absolute w-100 mt-1 p-1"
          style={{ zIndex: 20, maxHeight: 240, overflowY: 'auto' }}
        >
          {results.map((emp) => (
            <div
              key={emp.id}
              className="p-2 rounded"
              style={{ cursor: 'pointer' }}
              onMouseDown={() => { onSelect(emp); setKeyword(''); setOpen(false); }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{emp.firstName} {emp.lastName}</div>
              <div className="text-muted small">{emp.employeeCode}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeePicker;