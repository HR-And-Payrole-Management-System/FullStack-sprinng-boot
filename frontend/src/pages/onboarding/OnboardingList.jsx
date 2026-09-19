import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tabs, Tab } from 'react-bootstrap';
import { onboardingApi } from '../../api/onboarding.api';
import StartOnboardingModal from './StartOnboardingModal';
import OnboardingTemplateFormModal from './OnboardingTemplateFormModal';

function ProcessCard({ p, onClick }) {
  return (
    <div className="ent-card p-3" style={{ cursor: 'pointer' }} onClick={onClick}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-semibold">{p.employeeName}</div>
          <div className="text-muted small">{p.templateName} · Started {p.startDate}</div>
        </div>
        <div className="fw-bold">{p.progressPercent}%</div>
      </div>
      <div className="progress mt-2" style={{ height: 6 }}>
        <div className="progress-bar" style={{ width: `${p.progressPercent}%` }} />
      </div>
    </div>
  );
}

export default function OnboardingList() {
  const [activeProcesses, setActiveProcesses] = useState([]);
  const [completedProcesses, setCompletedProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStart, setShowStart] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    Promise.all([onboardingApi.getActive(), onboardingApi.getCompleted()])
      .then(([activeRes, completedRes]) => {
        setActiveProcesses(activeRes.data);
        setCompletedProcesses(completedRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="ent-page-title mb-0">Onboarding</h1>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={() => setShowTemplate(true)}>+ New Template</Button>
          <Button variant="primary" size="sm" onClick={() => setShowStart(true)}>+ Start Onboarding</Button>
        </div>
      </div>

      <Tabs defaultActiveKey="active" className="mb-3">
        <Tab eventKey="active" title={`Active (${activeProcesses.length})`}>
          <div className="d-flex flex-column gap-3 pt-3">
            {activeProcesses.map((p) => (
              <ProcessCard key={p.id} p={p} onClick={() => navigate(`/onboarding/${p.employeeId}`)} />
            ))}
            {activeProcesses.length === 0 && <div className="text-muted small">No active onboarding processes.</div>}
          </div>
        </Tab>

        <Tab eventKey="completed" title={`Completed (${completedProcesses.length})`}>
          <div className="d-flex flex-column gap-3 pt-3">
            {completedProcesses.map((p) => (
              <ProcessCard key={p.id} p={p} onClick={() => navigate(`/onboarding/${p.employeeId}`)} />
            ))}
            {completedProcesses.length === 0 && <div className="text-muted small">No completed onboarding processes yet.</div>}
          </div>
        </Tab>
      </Tabs>

      <StartOnboardingModal show={showStart} onHide={() => setShowStart(false)} onStarted={load} />
      <OnboardingTemplateFormModal show={showTemplate} onHide={() => setShowTemplate(false)} onSaved={() => {}} />
    </div>
  );
}