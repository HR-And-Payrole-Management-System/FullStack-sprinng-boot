import { useEffect, useState } from 'react';
import { Tabs, Tab, Table, Button, Row, Col, Dropdown, Pagination, Form } from 'react-bootstrap';

import { leaveTypeService } from '../../services/leaveType.service';
import { leaveService } from '../../services/leave.service';
import { employeeService } from '../../services/employee.service';
import { useHasPermission } from '../../hooks/useHasPermission';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import LeaveTypeFormModal from './LeaveTypeFormModal';
import LeaveRequestFormModal from './LeaveRequestFormModal';
import ReviewLeaveModal from './ReviewLeaveModal';

function LeaveManagementPage() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const canApprove = useHasPermission('LEAVE_APPROVE');
  const canManageTypes = useHasPermission('LEAVE_TYPE_CREATE');

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [typeFormShow, setTypeFormShow] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeSubmitting, setTypeSubmitting] = useState(false);
  const [deleteTypeTarget, setDeleteTypeTarget] = useState(null);
  const [deletingType, setDeletingType] = useState(false);

  // ---- "My Requests" (self-service, uses logged-in user's employeeId) ----
  const [myPage, setMyPage] = useState({ content: [], totalPages: 0, totalElements: 0, page: 0 });
  const [myPageNum, setMyPageNum] = useState(0);
  const [loadingMy, setLoadingMy] = useState(true);
  const [requestFormShow, setRequestFormShow] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  // ---- "Review by Employee" (manager/HR lookup one employee at a time) ----
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [reviewPage, setReviewPage] = useState({ content: [], totalPages: 0, totalElements: 0, page: 0 });
  const [reviewPageNum, setReviewPageNum] = useState(0);
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewAction, setReviewAction] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const loadTypes = () => {
    setLoadingTypes(true);
    leaveTypeService.list().then(setLeaveTypes).catch(() => showToast('មិនអាចទាញយកបានទេ', 'danger')).finally(() => setLoadingTypes(false));
  };

  const loadMy = () => {
    if (!user?.employeeId) { setLoadingMy(false); return; }
    setLoadingMy(true);
    leaveService.listByEmployee(user.employeeId, myPageNum, 5).then(setMyPage).catch(() => {}).finally(() => setLoadingMy(false));
  };

  const loadReview = () => {
    if (!selectedEmployeeId) { setReviewPage({ content: [], totalPages: 0, totalElements: 0, page: 0 }); return; }
    setLoadingReview(true);
    leaveService.listByEmployee(selectedEmployeeId, reviewPageNum, 10).then(setReviewPage).catch(() => showToast('មិនអាចទាញយកបានទេ', 'danger')).finally(() => setLoadingReview(false));
  };

  useEffect(loadTypes, []);
  useEffect(loadMy, [myPageNum, user]);
  useEffect(() => { employeeService.list({ page: 0, size: 200 }).then((p) => setEmployees(p.content || [])); }, []);
  useEffect(loadReview, [selectedEmployeeId, reviewPageNum]);

  // ---- Leave Type handlers ----
  const handleTypeSubmit = async (values) => {
    setTypeSubmitting(true);
    try {
      if (editingType) { await leaveTypeService.update(editingType.id, values); showToast('កែប្រែជោគជ័យ', 'success'); }
      else { await leaveTypeService.create(values); showToast('បង្កើតជោគជ័យ', 'success'); }
      setTypeFormShow(false);
      loadTypes();
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា', 'danger');
    } finally {
      setTypeSubmitting(false);
    }
  };

  const handleDeleteType = async () => {
    setDeletingType(true);
    try {
      await leaveTypeService.remove(deleteTypeTarget.id);
      showToast('លុបជោគជ័យ', 'success');
      setDeleteTypeTarget(null);
      loadTypes();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចលុបបានទេ', 'danger');
    } finally {
      setDeletingType(false);
    }
  };

  // ---- Leave Request handlers ----
  const handleRequestSubmit = async (values) => {
    setRequestSubmitting(true);
    try {
      await leaveService.create(user.employeeId, { ...values, leaveTypeId: Number(values.leaveTypeId) });
      showToast('ដាក់ស្នើសុំច្បាប់ជោគជ័យ', 'success');
      setRequestFormShow(false);
      loadMy();
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា', 'danger');
    } finally {
      setRequestSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await leaveService.cancel(id);
      showToast('បោះបង់ជោគជ័យ', 'success');
      loadMy();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចបោះបង់បានទេ', 'danger');
    }
  };

  const handleReviewSubmit = async (comment) => {
    setReviewSubmitting(true);
    try {
      if (reviewAction === 'approve') await leaveService.approve(reviewTarget.id, comment);
      else await leaveService.reject(reviewTarget.id, comment);
      showToast('ធ្វើសម្រេចជោគជ័យ', 'success');
      setReviewTarget(null);
      loadReview();
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា', 'danger');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const statusPill = (status) => {
    const map = { PENDING: 'ent-pill-warning', APPROVED: 'ent-pill-success', REJECTED: 'ent-pill-danger', CANCELLED: 'ent-pill-neutral' };
    return <span className={`ent-pill ${map[status] || 'ent-pill-neutral'}`}>{status}</span>;
  };

  if (loadingTypes) return <LoadingSpinner fullPage />;

  const pendingInReview = reviewPage.content.filter((r) => r.status === 'PENDING').length;
  const reviewChartData = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']
    .map((s) => ({ name: s, value: reviewPage.content.filter((r) => r.status === s).length }))
    .filter((d) => d.value > 0);

  return (
    <div>
      <div className="ent-page-title mb-3">Leave Management</div>

      <div className="ent-card p-3">
        <Tabs defaultActiveKey="my" className="mb-3">
          {/* ============ My Requests ============ */}
          <Tab eventKey="my" title="My Requests">
            <div className="d-flex justify-content-end mb-3 pt-2">
              <Button className="ent-btn-primary" onClick={() => setRequestFormShow(true)} disabled={!user?.employeeId}>+ New Request</Button>
            </div>
            {!user?.employeeId ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">⚠️</div>
                <div style={{ fontWeight: 600 }}>Account not linked to an Employee record</div>
                <div className="small">Link your account from an Employee profile to submit leave requests.</div>
              </div>
            ) : loadingMy ? <LoadingSpinner /> : myPage.content.length === 0 ? (
              <div className="ent-empty"><div className="ent-empty-icon">🌴</div><div style={{ fontWeight: 600 }}>No leave requests yet</div></div>
            ) : (
              <>
                <Table responsive className="ent-table mb-3">
                  <thead><tr><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th style={{ width: 90 }}></th></tr></thead>
                  <tbody>
                    {myPage.content.map((r) => (
                      <tr key={r.id}>
                        <td>{r.leaveTypeName}</td>
                        <td>{r.startDate} → {r.endDate}</td>
                        <td>{r.totalDays}</td>
                        <td>{r.reason}</td>
                        <td>{statusPill(r.status)}</td>
                        <td>{r.status === 'PENDING' && <Button size="sm" variant="light" className="text-danger" onClick={() => handleCancel(r.id)}>Cancel</Button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination className="justify-content-end mb-0">
                  <Pagination.Prev disabled={myPage.page === 0} onClick={() => setMyPageNum((p) => p - 1)} />
                  {Array.from({ length: myPage.totalPages }).map((_, i) => (
                    <Pagination.Item key={i} active={i === myPage.page} onClick={() => setMyPageNum(i)}>{i + 1}</Pagination.Item>
                  ))}
                  <Pagination.Next disabled={myPage.page >= myPage.totalPages - 1} onClick={() => setMyPageNum((p) => p + 1)} />
                </Pagination>
              </>
            )}
          </Tab>

          {/* ============ Review by Employee (manager/HR) ============ */}
          {canApprove && (
            <Tab eventKey="review" title="Review Requests">
              <div className="pt-2">
                <Form.Group className="mb-3" style={{ maxWidth: 320 }}>
                  <Form.Label className="small fw-semibold">Select Employee</Form.Label>
                  <Form.Select value={selectedEmployeeId} onChange={(e) => { setReviewPageNum(0); setSelectedEmployeeId(e.target.value); }}>
                    <option value="">-- Select an employee --</option>
                    {employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>)}
                  </Form.Select>
                  <div className="text-muted mt-1" style={{ fontSize: 'var(--text-xs)' }}>
                    ⚠️ No "all pending requests" endpoint exists yet — review one employee's history at a time.
                  </div>
                </Form.Group>

                {selectedEmployeeId && (
                  <>
                    <Row className="g-3 mb-3">
                      <Col md={4}><TrendStatCard label="Pending" value={pendingInReview} icon="⏳" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" /></Col>
                      <Col md={4}><TrendStatCard label="Total (this page)" value={reviewPage.content.length} icon="🌴" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" /></Col>
                      <Col md={4}><DonutChart data={reviewChartData} title="Status Breakdown" centerLabel="Shown" height={150} /></Col>
                    </Row>

                    {loadingReview ? <LoadingSpinner /> : reviewPage.content.length === 0 ? (
                      <div className="ent-empty"><div className="ent-empty-icon">🌴</div><div style={{ fontWeight: 600 }}>No leave requests for this employee</div></div>
                    ) : (
                      <>
                        <Table responsive className="ent-table mb-3">
                          <thead><tr><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th style={{ width: 70 }}></th></tr></thead>
                          <tbody>
                            {reviewPage.content.map((r) => (
                              <tr key={r.id}>
                                <td>{r.leaveTypeName}</td>
                                <td>{r.startDate} → {r.endDate}</td>
                                <td>{r.totalDays}</td>
                                <td>{r.reason}</td>
                                <td>{statusPill(r.status)}</td>
                                <td className="text-end">
                                  {r.status === 'PENDING' && (
                                    <Dropdown align="end">
                                      <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => { setReviewTarget(r); setReviewAction('approve'); }}>Approve</Dropdown.Item>
                                        <Dropdown.Item className="text-danger" onClick={() => { setReviewTarget(r); setReviewAction('reject'); }}>Reject</Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <Pagination className="justify-content-end mb-0">
                          <Pagination.Prev disabled={reviewPage.page === 0} onClick={() => setReviewPageNum((p) => p - 1)} />
                          {Array.from({ length: reviewPage.totalPages }).map((_, i) => (
                            <Pagination.Item key={i} active={i === reviewPage.page} onClick={() => setReviewPageNum(i)}>{i + 1}</Pagination.Item>
                          ))}
                          <Pagination.Next disabled={reviewPage.page >= reviewPage.totalPages - 1} onClick={() => setReviewPageNum((p) => p + 1)} />
                        </Pagination>
                      </>
                    )}
                  </>
                )}
              </div>
            </Tab>
          )}

          {/* ============ Leave Types (admin) ============ */}
          {canManageTypes && (
            <Tab eventKey="types" title="Leave Types">
              <div className="d-flex justify-content-end mb-3 pt-2">
                <Button className="ent-btn-primary" onClick={() => { setEditingType(null); setTypeFormShow(true); }}>+ New Type</Button>
              </div>
              {leaveTypes.length === 0 ? (
                <div className="ent-empty"><div className="ent-empty-icon">🌴</div><div style={{ fontWeight: 600 }}>No leave types yet</div></div>
              ) : (
                <Table responsive className="ent-table mb-0">
                  <thead><tr><th>Name</th><th>Default Days</th><th>Paid</th><th>Status</th><th style={{ width: 70 }}></th></tr></thead>
                  <tbody>
                    {leaveTypes.map((t) => (
                      <tr key={t.id}>
                        <td style={{ fontWeight: 600 }}>{t.name}</td>
                        <td>{t.defaultDays}</td>
                        <td>{t.paidLeave ? <span className="ent-pill ent-pill-success">Paid</span> : <span className="ent-pill ent-pill-neutral">Unpaid</span>}</td>
                        <td><span className={`ent-pill ${t.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>{t.status}</span></td>
                        <td className="text-end">
                          <Dropdown align="end">
                            <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => { setEditingType(t); setTypeFormShow(true); }}>Edit</Dropdown.Item>
                              <Dropdown.Item className="text-danger" onClick={() => setDeleteTypeTarget(t)}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
          )}
        </Tabs>
      </div>

      <LeaveRequestFormModal show={requestFormShow} leaveTypes={leaveTypes} submitting={requestSubmitting} onClose={() => setRequestFormShow(false)} onSubmit={handleRequestSubmit} />
      <ReviewLeaveModal show={!!reviewTarget} action={reviewAction} request={reviewTarget} submitting={reviewSubmitting} onClose={() => setReviewTarget(null)} onSubmit={handleReviewSubmit} />
      <LeaveTypeFormModal show={typeFormShow} initialData={editingType} submitting={typeSubmitting} onClose={() => setTypeFormShow(false)} onSubmit={handleTypeSubmit} />
      <ConfirmModal show={!!deleteTypeTarget} title="Delete Leave Type" body={`តើអ្នកប្រាកដថាចង់លុប "${deleteTypeTarget?.name}" មែនទេ?`} confirming={deletingType} onConfirm={handleDeleteType} onCancel={() => setDeleteTypeTarget(null)} />
    </div>
  );
}

export default LeaveManagementPage;