import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import { performanceService } from '../../services/performance.service';
import { useHasPermission } from '../../hooks/useHaspermission';
import { useToast } from '../../context/ToastContext';

import EmployeePicker from './EmployeePicker';
import GoalsList from './GoalsList';
import GoalFormModal from './GoalFormModal';
import ReviewCard from './ReviewCard';
import LoadingSpinner from '../../components/LoadingSpinner';

function EmployeePerformancePanel({ cycles }) {
  const { showToast } = useToast();
  const canCreateGoal = useHasPermission('PERFORMANCE_CREATE');
  const canUpdateGoal = useHasPermission('PERFORMANCE_UPDATE');
  const canManagerReview = useHasPermission('PERFORMANCE_REVIEW');

  // ថ្មី — មានតែ ACTIVE ប៉ុណ្ណោះ ដែលអាចបន្ថែម Goal/Review បាន
const activeCycles = cycles.filter((c) => c.status === 'ACTIVE');
  const [employee, setEmployee] = useState(null);
  const [cycleId, setCycleId] = useState(activeCycles[0]?.id || '');
  const [goals, setGoals] = useState([]);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [goalFormShow, setGoalFormShow] = useState(false);

  const load = () => {
    if (!employee || !cycleId) return;
    setLoading(true);
    Promise.all([
      performanceService.listGoals(employee.id, cycleId),
      performanceService.getReview(employee.id, cycleId),
    ])
      .then(([g, r]) => { setGoals(g); setReview(r); })
      .catch(() => showToast('មិនអាចទាញយកទិន្នន័យបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [employee, cycleId]);

  const handleAddGoal = async (values) => {
    try {
      await performanceService.createGoal(employee.id, values);
      showToast('បន្ថែម Goal ជោគជ័យ', 'success');
      setGoalFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា', 'danger');
    }
  };

  const handleProgress = async (goalId, progress) => {
    try {
      await performanceService.updateGoalProgress(goalId, progress);
      showToast('ធ្វើបច្ចុប្បន្នភាព Progress ជោគជ័យ', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចធ្វើបានទេ', 'danger');
    }
  };

  const handleSelfReview = async (data) => {
    try {
      await performanceService.submitSelfReview(employee.id, cycleId, data);
      showToast('បាន Submit Self Review', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចធ្វើបានទេ', 'danger');
    }
  };

  const handleManagerReview = async (data) => {
    try {
      await performanceService.submitManagerReview(employee.id, cycleId, data);
      showToast('បាន Submit Manager Review', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចធ្វើបានទេ', 'danger');
    }
  };

  const handleComplete = async () => {
    try {
      await performanceService.completeReview(employee.id, cycleId);
      showToast('Review បានបញ្ចប់', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចធ្វើបានទេ', 'danger');
    }
  };

  return (
    <div>
      <div className="ent-card p-3 mb-3 d-flex flex-wrap gap-3 align-items-end">
        <div>
          <div className="small text-muted mb-1">Employee</div>
          <EmployeePicker value={employee} onSelect={setEmployee} />
        </div>
        <div>
          <div className="small text-muted mb-1">Cycle</div>
          <Form.Select value={cycleId} onChange={(e) => setCycleId(e.target.value)} style={{ width: 220 }}>
            <option value="">Select cycle...</option>
            {activeCycles.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.status})</option>)}
          </Form.Select>
        </div>
      </div>

      {!employee || !cycleId ? (
        <div className="ent-empty py-5">
          <div className="ent-empty-icon">🔍</div>
          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>Select an employee and cycle to begin</div>
        </div>
      ) : loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>GOALS</div>
            {canCreateGoal && <Button size="sm" className="ent-btn-primary" onClick={() => setGoalFormShow(true)}>+ Add Goal</Button>}
          </div>
          <GoalsList goals={goals} canUpdate={canUpdateGoal} onUpdateProgress={handleProgress} />

          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }} className="mb-2 mt-4">REVIEW</div>
          <ReviewCard
            review={review}
            canSelfReview={canUpdateGoal}
            canManagerReview={canManagerReview}
            onSelfReview={handleSelfReview}
            onManagerReview={handleManagerReview}
            onComplete={handleComplete}
          />
        </>
      )}

      <GoalFormModal show={goalFormShow} cycleId={cycleId} submitting={false} onClose={() => setGoalFormShow(false)} onSubmit={handleAddGoal} />
    </div>
  );
}

export default EmployeePerformancePanel;