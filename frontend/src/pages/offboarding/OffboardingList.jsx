import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tabs, Tab } from 'react-bootstrap';
import { offboardingApi } from '../../api/offboarding.api';
import StartOffboardingModal from './StartOffboardingModal';
import OffboardingTemplateFormModal from './OffboardingTemplateFormModal';

function ProcessCard({ p, onClick }) {
  return (
    <div className="ent-card p-3" style={{ cursor: 'pointer' }} onClick={onClick}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-semibold">{p.employeeName}</div>
          <div className="text-muted small">{p.reason.replace('_', ' ')} · Last day {p.lastWorkingDate}</div>
        </div>
        <div className="fw-bold">{p.progressPercent}%</div>
      </div>
      <div className="progress mt-2" style={{ height: 6 }}>
        <div className="progress-bar bg-danger" style={{ width: `${p.progressPercent}%` }} />
      </div>
    </div>
  );
}

export default function OffboardingList() {
  const [activeProcesses, setActiveProcesses] = useState([]);
  const [completedProcesses, setCompletedProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStart, setShowStart] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    Promise.all([offboardingApi.getActive(), offboardingApi.getCompleted()])
      .then(([activeRes, completedRes]) => {
        setActiveProcesses(activeRes.data);
        setCompletedProcesses(completedRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="ent-page-title">Loading…</div>;

  return (
    <div className="p-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="ent-page-title">Offboarding</div>
        <div className="d-flex gap-2">
          <Button variant="outline-danger" size="sm" onClick={() => setShowTemplate(true)}>+ New Template</Button>
          <Button variant="danger" size="sm" onClick={() => setShowStart(true)}>+ Start Offboarding</Button>
        </div>
      </div>

      <Tabs defaultActiveKey="active" className="mb-3">
        <Tab eventKey="active" title={`Active (${activeProcesses.length})`}>
          <div className="d-flex flex-column gap-3 pt-3">
            {activeProcesses.map((p) => (
              <ProcessCard key={p.id} p={p} onClick={() => navigate(`/offboarding/${p.employeeId}`)} />
            ))}
            {activeProcesses.length === 0 && <div className="text-muted small">No active offboarding processes.</div>}
          </div>
        </Tab>

        <Tab eventKey="completed" title={`Completed (${completedProcesses.length})`}>
          <div className="d-flex flex-column gap-3 pt-3">
            {completedProcesses.map((p) => (
              <ProcessCard key={p.id} p={p} onClick={() => navigate(`/offboarding/${p.employeeId}`)} />
            ))}
            {completedProcesses.length === 0 && <div className="text-muted small">No completed offboarding processes yet.</div>}
          </div>
        </Tab>
      </Tabs>

      <StartOffboardingModal show={showStart} onHide={() => setShowStart(false)} onStarted={load} />
      <OffboardingTemplateFormModal show={showTemplate} onHide={() => setShowTemplate(false)} onSaved={() => {}} />
    </div>
  );
}