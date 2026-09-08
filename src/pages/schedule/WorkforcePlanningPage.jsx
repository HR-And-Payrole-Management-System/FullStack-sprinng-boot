import { useEffect, useState, useMemo } from 'react';
import { Tabs, Tab, Table, Button, Row, Col, Dropdown } from 'react-bootstrap';

import { workScheduleService } from '../../services/workSchedule.service';
import { holidayService } from '../../services/holiday.service';
import { companyService } from '../../services/company.service';
import { useHasPermission } from '../../hooks/useHasPermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import WorkScheduleFormModal from './WorkScheduleFormModal';
import HolidayFormModal from '../holiday/HolidayFormModal';

function fmtTime(t) {
  if (!t) return '—';
  return t.slice(0, 5);
}

function WorkforcePlanningPage() {
  const { showToast } = useToast();
  const canCreateSchedule = useHasPermission('SCHEDULE_CREATE');
  const canUpdateSchedule = useHasPermission('SCHEDULE_UPDATE');
  const canDeleteSchedule = useHasPermission('SCHEDULE_DELETE');
  const canCreateHoliday = useHasPermission('HOLIDAY_CREATE');
  const canUpdateHoliday = useHasPermission('HOLIDAY_UPDATE');
  const canDeleteHoliday = useHasPermission('HOLIDAY_DELETE');

  const [schedules, setSchedules] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [scheduleFormShow, setScheduleFormShow] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
  const [deleteScheduleTarget, setDeleteScheduleTarget] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(false);

  const [holidayFormShow, setHolidayFormShow] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [holidaySubmitting, setHolidaySubmitting] = useState(false);
  const [deleteHolidayTarget, setDeleteHolidayTarget] = useState(null);
  const [deletingHoliday, setDeletingHoliday] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([workScheduleService.list(), holidayService.list(), companyService.list()])
      .then(([s, h, c]) => { setSchedules(s); setHolidays(h); setCompanies(c); })
      .catch(() => showToast('មិនអាចទាញយកទិន្នន័យបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const upcomingHolidays = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return holidays.filter((h) => h.holidayDate >= today).length;
  }, [holidays]);

  const byType = useMemo(() => {
    const map = {};
    holidays.forEach((h) => { map[h.type] = (map[h.type] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  }, [holidays]);

  // ---- Schedule handlers ----
  const handleScheduleSubmit = async (values) => {
    setScheduleSubmitting(true);
    try {
      if (editingSchedule) {
        await workScheduleService.update(editingSchedule.id, values);
        showToast('កែប្រែកាលវិភាគជោគជ័យ', 'success');
      } else {
        await workScheduleService.create(values);
        showToast('បង្កើតកាលវិភាគជោគជ័យ', 'success');
      }
      setScheduleFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា', 'danger');
    } finally {
      setScheduleSubmitting(false);
    }
  };

  const handleDeleteSchedule = async () => {
    setDeletingSchedule(true);
    try {
      await workScheduleService.remove(deleteScheduleTarget.id);
      showToast('លុបកាលវិភាគជោគជ័យ', 'success');
      setDeleteScheduleTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចលុបបានទេ', 'danger');
    } finally {
      setDeletingSchedule(false);
    }
  };

  // ---- Holiday handlers ----
  const handleHolidaySubmit = async (values) => {
    setHolidaySubmitting(true);
    try {
      const payload = {
        ...values,
        companyId: values.companyId ? Number(values.companyId) : null,
        branchId: values.branchId ? Number(values.branchId) : null,
      };
      if (editingHoliday) {
        await holidayService.update(editingHoliday.id, payload);
        showToast('កែប្រែថ្ងៃឈប់សម្រាកជោគជ័យ', 'success');
      } else {
        await holidayService.create(payload);
        showToast('បង្កើតថ្ងៃឈប់សម្រាកជោគជ័យ', 'success');
      }
      setHolidayFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា', 'danger');
    } finally {
      setHolidaySubmitting(false);
    }
  };

  const handleDeleteHoliday = async () => {
    setDeletingHoliday(true);
    try {
      await holidayService.remove(deleteHolidayTarget.id);
      showToast('លុបថ្ងៃឈប់សម្រាកជោគជ័យ', 'success');
      setDeleteHolidayTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចលុបបានទេ', 'danger');
    } finally {
      setDeletingHoliday(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-page-title mb-3">Work Schedule & Holidays</div>

      <Row className="g-3 mb-3">
        <Col md={3}><TrendStatCard label="Total Schedules" value={schedules.length} icon="🕒" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" /></Col>
        <Col md={3}><TrendStatCard label="Total Holidays" value={holidays.length} icon="🎌" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" /></Col>
        <Col md={3}><TrendStatCard label="Upcoming Holidays" value={upcomingHolidays} icon="📅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" /></Col>
        <Col md={3}><TrendStatCard label="Paid Holidays" value={holidays.filter((h) => h.paidHoliday).length} icon="💰" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" /></Col>
      </Row>

      <div className="ent-card p-3">
        <Tabs defaultActiveKey="schedules" className="mb-3">
          <Tab eventKey="schedules" title="Work Schedules">
            <div className="d-flex justify-content-end mb-3 pt-2">
              {canCreateSchedule && (
                <Button className="ent-btn-primary" onClick={() => { setEditingSchedule(null); setScheduleFormShow(true); }}>+ New Schedule</Button>
              )}
            </div>

            {schedules.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">🕒</div>
                <div style={{ fontWeight: 600 }}>No work schedules yet</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr><th>Name</th><th>Hours</th><th>Break</th><th>Working Days</th><th>Status</th><th style={{ width: 70 }}></th></tr>
                </thead>
                <tbody>
                  {schedules.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{fmtTime(s.startTime)} – {fmtTime(s.endTime)}</td>
                      <td>{s.breakMinutes} min</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {Array.from(s.workingDays || []).map((d) => (
                            <span key={d} className="ent-pill ent-pill-neutral">{d.slice(0, 3)}</span>
                          ))}
                        </div>
                      </td>
                      <td><span className={`ent-pill ${s.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>{s.status}</span></td>
                      <td className="text-end">
                        <Dropdown align="end">
                          <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                          <Dropdown.Menu>
                            {canUpdateSchedule && <Dropdown.Item onClick={() => { setEditingSchedule(s); setScheduleFormShow(true); }}>Edit</Dropdown.Item>}
                            {canDeleteSchedule && <Dropdown.Item className="text-danger" onClick={() => setDeleteScheduleTarget(s)}>Delete</Dropdown.Item>}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>

          <Tab eventKey="holidays" title="Holidays">
            <Row className="g-3 pt-2 mb-3">
              <Col md={4}>
                <DonutChart data={byType} title="Holidays by Type" centerLabel="Total" height={180} />
              </Col>
              <Col md={8}>
                <div className="d-flex justify-content-end mb-2">
                  {canCreateHoliday && (
                    <Button className="ent-btn-primary" onClick={() => { setEditingHoliday(null); setHolidayFormShow(true); }}>+ New Holiday</Button>
                  )}
                </div>
                {holidays.length === 0 ? (
                  <div className="ent-empty">
                    <div className="ent-empty-icon">🎌</div>
                    <div style={{ fontWeight: 600 }}>No holidays yet</div>
                  </div>
                ) : (
                  <Table responsive className="ent-table mb-0">
                    <thead>
                      <tr><th>Name</th><th>Date</th><th>Type</th><th>Scope</th><th>Paid</th><th style={{ width: 70 }}></th></tr>
                    </thead>
                    <tbody>
                      {holidays
                        .sort((a, b) => a.holidayDate.localeCompare(b.holidayDate))
                        .map((h) => (
                        <tr key={h.id}>
                          <td style={{ fontWeight: 600 }}>{h.name}</td>
                          <td>{h.holidayDate}</td>
                          <td>
                            {h.holidayDate === h.endDate
                              ? h.holidayDate
                              : `${h.holidayDate} → ${h.endDate}`}
                          </td>
                          <td><span className="ent-pill ent-pill-neutral">{h.type.replace('_', ' ')}</span></td>
                          <td>{h.branchName || h.companyName || 'All'}</td>
                          <td>{h.paidHoliday ? <span className="ent-pill ent-pill-success">Paid</span> : <span className="ent-pill ent-pill-neutral">Unpaid</span>}</td>
                          <td className="text-end">
                            <Dropdown align="end">
                              <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                              <Dropdown.Menu>
                                {canUpdateHoliday && <Dropdown.Item onClick={() => { setEditingHoliday(h); setHolidayFormShow(true); }}>Edit</Dropdown.Item>}
                                {canDeleteHoliday && <Dropdown.Item className="text-danger" onClick={() => setDeleteHolidayTarget(h)}>Delete</Dropdown.Item>}
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </div>

      <WorkScheduleFormModal
        show={scheduleFormShow}
        initialData={editingSchedule}
        submitting={scheduleSubmitting}
        onClose={() => setScheduleFormShow(false)}
        onSubmit={handleScheduleSubmit}
      />
      <ConfirmModal
        show={!!deleteScheduleTarget}
        title="Delete Work Schedule"
        body={`តើអ្នកប្រាកដថាចង់លុប "${deleteScheduleTarget?.name}" មែនទេ?`}
        confirming={deletingSchedule}
        onConfirm={handleDeleteSchedule}
        onCancel={() => setDeleteScheduleTarget(null)}
      />

      <HolidayFormModal
        show={holidayFormShow}
        initialData={editingHoliday}
        companies={companies}
        submitting={holidaySubmitting}
        onClose={() => setHolidayFormShow(false)}
        onSubmit={handleHolidaySubmit}
      />
      <ConfirmModal
        show={!!deleteHolidayTarget}
        title="Delete Holiday"
        body={`តើអ្នកប្រាកដថាចង់លុប "${deleteHolidayTarget?.name}" មែនទេ?`}
        confirming={deletingHoliday}
        onConfirm={handleDeleteHoliday}
        onCancel={() => setDeleteHolidayTarget(null)}
      />
    </div>
  );
}

export default WorkforcePlanningPage;