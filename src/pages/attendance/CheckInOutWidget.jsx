import { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';

import { attendanceService } from '../../services/attendance.service';
import { useToast } from '../../context/ToastContext';

function formatTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CheckInOutWidget({ onDone }) {
  const { showToast } = useToast();
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadToday = () => {
    setLoading(true);
    attendanceService
      .getTodaySelf()
      .then(setToday)
      .catch(() => showToast('មិនអាចផ្ទុកស្ថានភាព attendance ថ្ងៃនេះបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doAction = async (action) => {
    setActionLoading(true);
    try {
      const result =
        action === 'in'
          ? await attendanceService.checkInSelf()
          : await attendanceService.checkOutSelf();

      setToday(result);
      showToast(action === 'in' ? 'Check-in ជោគជ័យ' : 'Check-out ជោគជ័យ', 'success');
      onDone?.();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចធ្វើបានទេ', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const hasCheckedIn = !!today?.checkInTime;
  const hasCheckedOut = !!today?.checkOutTime;

  return (
    <div className="ent-card p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
      <div>
        <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>Time Clock</div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          {new Date().toLocaleString()}
        </div>
        {!loading && (
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }} className="mt-1">
            Check-in: <strong>{formatTime(today?.checkInTime)}</strong>
            {'  ·  '}
            Check-out: <strong>{formatTime(today?.checkOutTime)}</strong>
          </div>
        )}
      </div>

      <div className="d-flex gap-2">
        {loading ? (
          <Spinner size="sm" animation="border" />
        ) : hasCheckedIn && hasCheckedOut ? (
          <span className="ent-pill ent-pill-success">Completed for today</span>
        ) : hasCheckedIn ? (
          <Button variant="danger" disabled={actionLoading} onClick={() => doAction('out')}>
            {actionLoading ? <Spinner size="sm" animation="border" /> : 'Check Out'}
          </Button>
        ) : (
          <Button variant="success" disabled={actionLoading} onClick={() => doAction('in')}>
            {actionLoading ? <Spinner size="sm" animation="border" /> : 'Check In'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default CheckInOutWidget;