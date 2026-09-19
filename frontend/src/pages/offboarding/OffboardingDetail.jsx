import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { offboardingApi } from '../../api/offboarding.api';
import { Button } from 'react-bootstrap';

export default function OffboardingDetail() {
  const { employeeId } = useParams();
  const [process, setProcess] = useState(null);

  const load = () => offboardingApi.getByEmployee(employeeId).then((res) => setProcess(res.data));
  useEffect(() => { load(); }, [employeeId]);

  if (!process) return <div className="ent-page-title">Loading…</div>;

  return (
    <div className="p-6">
      <div className="ent-page-title">{process.employeeName}'s Offboarding</div>
      <div className="text-muted small mb-3">
        {process.reason.replace('_', ' ')} · Last day {process.lastWorkingDate} · {process.progressPercent}% complete
        {process.status === 'COMPLETED' && <span className="badge bg-success ms-2">Separation finalized</span>}
      </div>

      <div className="d-flex flex-column gap-2">
        {process.tasks.map((t) => (
          <div key={t.id} className={`ent-card p-3 d-flex justify-content-between align-items-center ${t.overdue ? 'border-danger' : ''}`}>
            <div>
              <div className="fw-semibold small">{t.title} {t.mandatory && <span className="text-danger">*</span>}</div>
              <div className="text-muted small">{t.assignedRole} · Due {t.dueDate}{t.overdue ? ' · Overdue' : ''}</div>
            </div>
            {['PENDING', 'IN_PROGRESS'].includes(t.status) ? (
              <div className="d-flex gap-2">
                {!t.mandatory && (
                  <Button size="sm" variant="outline-secondary" onClick={() => offboardingApi.skipTask(t.id).then(load)}>Skip</Button>
                )}
                <Button size="sm" variant="danger" onClick={() => offboardingApi.completeTask(t.id).then(load)}>Complete</Button>
              </div>
            ) : (
              <span className="badge bg-success">{t.status}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}