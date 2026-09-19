import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { attendanceApi } from '../../api/attendance.api';
import { leaveApi } from '../../api/leave.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

function EmployeeDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [today, setToday] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = () => {
    setLoading(true);
    const calls = [attendanceApi.getTodaySelf().catch(() => null)];
    if (user?.employeeId) {
      calls.push(leaveApi.getByEmployeeId(user.employeeId, 0, 5).catch(() => null));
    }
    Promise.all(calls)
      .then(([t, l]) => {
        setToday(t);
        setLeaves(l?.data?.content || l?.content || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [user?.employeeId]);

  const handleCheckIn = async () => {
    setActing(true);
    try {
      await attendanceApi.checkInSelf();
      showToast('Checked in successfully', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Check-in failed', 'danger');
    } finally {
      setActing(false);
    }
  };

  const handleCheckOut = async () => {
    setActing(true);
    try {
      await attendanceApi.checkOutSelf();
      showToast('Checked out successfully', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Check-out failed', 'danger');
    } finally {
      setActing(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const checkedIn = !!today?.checkInTime;
  const checkedOut = !!today?.checkOutTime;

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">My Dashboard</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Welcome back, {user?.firstName}
          </div>
        </div>
      </div>

      <div className="ent-card p-3 mb-3">
        <div className="fw-semibold mb-2">Today's Attendance</div>
        {!today ? (
          <div className="text-muted small">No record yet today.</div>
        ) : (
          <div className="d-flex gap-4 small text-muted mb-2">
            <span>Check-in: {today.checkInTime ? today.checkInTime.slice(11, 16) : '—'}</span>
            <span>Check-out: {today.checkOutTime ? today.checkOutTime.slice(11, 16) : '—'}</span>
            <span>Status: <span className="ent-pill ent-pill-neutral">{today.status}</span></span>
          </div>
        )}
        <div className="d-flex gap-2 mt-2">
          <Button className="ent-btn-primary" disabled={checkedIn || acting} onClick={handleCheckIn}>Check In</Button>
          <Button variant="light" disabled={!checkedIn || checkedOut || acting} onClick={handleCheckOut}>Check Out</Button>
        </div>
      </div>

      <div className="ent-card p-3">
        <div className="fw-semibold mb-2">My Recent Leave Requests</div>
        {leaves.length === 0 ? (
          <div className="text-muted small">No leave requests yet.</div>
        ) : (
          leaves.map((l) => (
            <div key={l.id} className="d-flex justify-content-between border-bottom py-2 small">
              <span>{l.leaveTypeName} — {l.startDate} → {l.endDate}</span>
              <span className="ent-pill ent-pill-neutral">{l.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;