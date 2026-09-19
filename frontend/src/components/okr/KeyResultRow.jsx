import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Pencil, Check } from 'lucide-react';
import { okrApi } from '../../api/okr.api';

export default function KeyResultRow({ kr, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(kr.currentValue);

  const save = async () => {
    await okrApi.updateKeyResultProgress(kr.id, Number(value));
    setEditing(false);
    onUpdated();
  };

  return (
    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
      <div>
        <div className="small fw-medium">{kr.title}</div>
        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
          {kr.currentValue} / {kr.targetValue} {kr.unit}
        </div>
      </div>

      <div className="d-flex align-items-center gap-2" style={{ width: 220 }}>
        {editing ? (
          <>
            <Form.Control
              size="sm"
              type="number"
              value={value}
              autoFocus
              onChange={(e) => setValue(e.target.value)}
              style={{ width: 90 }}
            />
            <Button size="sm" variant="primary" className="d-flex align-items-center gap-1" onClick={save}>
              <Check size={14} /> Save
            </Button>
          </>
        ) : (
          <>
            <div className="progress flex-grow-1" style={{ height: 6 }}>
              <div className="progress-bar" style={{ width: `${kr.progressPercent}%` }} />
            </div>
            <span className="small fw-semibold" style={{ width: 36, textAlign: 'right' }}>{kr.progressPercent}%</span>
            <Button
              size="sm"
              variant="light"
              className="d-flex align-items-center justify-content-center p-1"
              style={{ width: 28, height: 28, borderRadius: '50%' }}
              onClick={() => setEditing(true)}
              aria-label="Edit progress"
            >
              <Pencil size={14} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}