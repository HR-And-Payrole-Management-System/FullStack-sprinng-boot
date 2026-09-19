// EmployeeProfile.jsx

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Tabs, Tab, Table } from 'react-bootstrap';
import {
  IdCard,
  Building2,
  Link2,
  Unlink,
  UserCog,
  Pencil,
  ShieldAlert,
  PhoneCall,
  Inbox,
  CalendarClock,
  Plus,
  Trash2,
} from 'lucide-react';

import { employeeService } from '../../services/employee.service';
import { workScheduleService } from '../../services/workSchedule.service';
import { useHasPermission } from '../../hooks/useHaspermission';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { resolveUploadUrl } from '../../utils/url';

import LoadingSpinner from '../../components/LoadingSpinner';
import ChangeStatusModal from '../../components/ChangeStatusModal';
import LinkAccountModal from '../../components/LinkAccountModal';
import ConfirmModal from '../../components/ConfirmModal';
import AssignScheduleModal from '../schedule/AssignScheduleModal';

// -------------------- HELPERS --------------------

function initials(fn = '', ln = '') {
  return `${fn[0] || ''}${ln[0] || ''}`.toUpperCase();
}

function Field({ label, value }) {
  return (
    <div className="mb-3">
      <div className="ent-label">{label}</div>
      <div className="ent-value">{value || '—'}</div>
    </div>
  );
}

function scheduleStatus(a) {
  const today = new Date().toISOString().slice(0, 10);
  if (a.endDate && a.endDate < today) return { label: 'Ended', pill: 'ent-pill-neutral' };
  if (a.effectiveDate > today) return { label: 'Upcoming', pill: 'ent-pill-neutral' };
  return { label: 'Active', pill: 'ent-pill-success' };
}

// -------------------- COMPONENT --------------------

function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const canUpdate = useHasPermission('EMPLOYEE_UPDATE');
  const canUpdateSchedule = useHasPermission('SCHEDULE_UPDATE');
  const { user, refreshUser } = useAuth();

  const [employee, setEmployee] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [statusShow, setStatusShow] = useState(false);
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  const [linkShow, setLinkShow] = useState(false);
  const [linkSubmitting, setLinkSubmitting] = useState(false);

  const [assignments, setAssignments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [assignShow, setAssignShow] = useState(false);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);

  // -------------------- LOAD DATA --------------------

  useEffect(() => {
    setLoading(true);

    Promise.all([
      employeeService.get(id),
      employeeService.getEmergencyContact(id),
      workScheduleService.getEmployeeAssignments(id),
      workScheduleService.list(),
    ])
      .then(([e, c, a, s]) => {
        setEmployee(e);
        setContact(c);
        setAssignments(a);
        setSchedules(s);
      })
      .catch(() => {
        showToast('Failed to load employee', 'danger');
      })
      .finally(() => setLoading(false));
  }, [id, showToast]);

  // -------------------- PHOTO --------------------

  const handlePhotoClick = () => {
    if (!canUpdate) return;
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Only JPG, PNG, WEBP allowed', 'danger');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast('Max size 3MB', 'danger');
      return;
    }

    setPhotoUploading(true);

    try {
      const updated = await employeeService.uploadPhoto(id, file);
      setEmployee(updated);

      if (user?.employeeId === Number(id)) {
        await refreshUser();
      }

      showToast('Photo updated', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'danger');
    } finally {
      setPhotoUploading(false);
    }
  };

  // -------------------- ACTIONS --------------------

  const handleChangeStatus = async (values) => {
    setStatusSubmitting(true);
    try {
      const updated = await employeeService.changeStatus(id, values);
      setEmployee(updated);
      showToast('Status updated', 'success');
      setStatusShow(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'danger');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleLinkAccount = async (userId) => {
    setLinkSubmitting(true);
    try {
      const updated = await employeeService.linkUserAccount(id, userId);
      setEmployee(updated);
      showToast('Linked successfully', 'success');
      setLinkShow(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'danger');
    } finally {
      setLinkSubmitting(false);
    }
  };

  const handleUnlink = async () => {
    setLinkSubmitting(true);
    try {
      await employeeService.unlinkUser(id);
      setEmployee((prev) => ({ ...prev, linkedUserEmail: null }));
      showToast('Unlinked', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'danger');
    } finally {
      setLinkSubmitting(false);
    }
  };

  // -------------------- WORK SCHEDULE --------------------

  const loadAssignments = () => {
    workScheduleService
      .getEmployeeAssignments(id)
      .then(setAssignments)
      .catch(() => showToast('មិនអាចទាញយកកាលវិភាគបានទេ', 'danger'));
  };

  const handleAssignSchedule = async (values) => {
    setAssignSubmitting(true);
    try {
      await workScheduleService.assignToEmployee(id, values);
      showToast('ចាត់តាំងកាលវិភាគជោគជ័យ', 'success');
      setAssignShow(false);
      loadAssignments();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចចាត់តាំងបានទេ', 'danger');
    } finally {
      setAssignSubmitting(false);
    }
  };

  const handleRemoveAssignment = async () => {
    setRemoving(true);
    try {
      await workScheduleService.removeAssignment(removeTarget.id);
      showToast('លុបការចាត់តាំងជោគជ័យ', 'success');
      setRemoveTarget(null);
      loadAssignments();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចលុបបានទេ', 'danger');
    } finally {
      setRemoving(false);
    }
  };

  // -------------------- UI --------------------

  if (loading) return <LoadingSpinner fullPage />;

  if (!employee) {
    return (
      <div className="ent-empty">
        <div className="ent-empty-icon">
          <Inbox size={26} strokeWidth={1.75} />
        </div>
        <div style={{ fontWeight: 600 }}>Employee not found</div>
      </div>
    );
  }

  return (
    <div className="ent-profile-page">
      {/* HERO CARD: banner + overlapping avatar */}
      <div className="ent-card ent-profile-hero">
        <div className="ent-profile-banner" />

        <div className="ent-profile-header">
          <div
            className={`ent-profile-avatar ${canUpdate ? 'ent-avatar-clickable' : ''}`}
            onClick={handlePhotoClick}
            title={canUpdate ? 'Click to change photo' : undefined}
          >
            {employee.photoUrl ? (
              <img
                src={resolveUploadUrl(employee.photoUrl)}
                alt="avatar"
                className="ent-profile-avatar-img"
              />
            ) : (
              <span>{initials(employee.firstName, employee.lastName)}</span>
            )}

            {photoUploading && (
              <div className="ent-avatar-overlay">
                <span className="spinner-border spinner-border-sm" />
              </div>
            )}
          </div>

          {canUpdate && (
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handlePhotoChange}
            />
          )}

          <div className="ent-profile-identity">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="ent-profile-name">
                {employee.firstName} {employee.lastName}
              </div>
              <span className={`ent-pill ${employee.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>
                {employee.status}
              </span>
            </div>
            <div className="ent-profile-subtitle">
              {employee.positionName || 'No position'} · {employee.departmentName || 'No department'}
            </div>
          </div>

          <div className="ent-profile-actions">
            {employee.linkedUserEmail ? (
              <>
                <span className="ent-pill ent-pill-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Link2 size={12} strokeWidth={2.25} />
                  {employee.linkedUserEmail}
                </span>
                <Button className="ent-btn-secondary" size="sm" onClick={handleUnlink}>
                  <Unlink size={14} strokeWidth={2} className="me-1" />
                  Unlink
                </Button>
              </>
            ) : (
              <Button className="ent-btn-secondary" size="sm" onClick={() => setLinkShow(true)}>
                <Link2 size={14} strokeWidth={2} className="me-1" />
                Link Account
              </Button>
            )}

            <Button className="ent-btn-secondary" size="sm" onClick={() => setStatusShow(true)}>
              <UserCog size={14} strokeWidth={2} className="me-1" />
              Change Status
            </Button>

            {canUpdate && (
              <Button className="ent-btn-primary" size="sm" onClick={() => navigate(`/employee/${id}/edit`)}>
                <Pencil size={14} strokeWidth={2} className="me-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* TABS + CONTENT */}
      <Tabs defaultActiveKey="profile" className="ent-profile-tabs mb-3">
        <Tab eventKey="profile" title="Profile">
          <Row className="g-3">
            <Col md={6}>
              <div className="ent-card p-4">
                <h6 className="ent-profile-section-title mb-3">
                  <IdCard size={16} strokeWidth={2.25} />
                  Basic Info
                </h6>
                <Field label="Code" value={employee.employeeCode} />
                <Field label="Email" value={employee.email} />
                <Field label="Phone" value={employee.phone} />
              </div>
            </Col>

            <Col md={6}>
              <div className="ent-card p-4">
                <h6 className="ent-profile-section-title mb-3">
                  <Building2 size={16} strokeWidth={2.25} />
                  Organization
                </h6>
                <Field label="Company" value={employee.companyName} />
                <Field label="Branch" value={employee.branchName} />
                <Field label="Department" value={employee.departmentName} />
                <Field label="Position" value={employee.positionName} />
              </div>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="emergency" title="Emergency Contact">
          <div className="ent-card p-4">
            {contact ? (
              <>
                <h6 className="ent-profile-section-title mb-3">
                  <ShieldAlert size={16} strokeWidth={2.25} />
                  Emergency Contact
                </h6>
                <Row>
                  <Col md={4}><Field label="Name" value={contact.contactName} /></Col>
                  <Col md={4}><Field label="Phone" value={contact.phone} /></Col>
                  <Col md={4}><Field label="Relation" value={contact.relationship} /></Col>
                </Row>
              </>
            ) : (
              <div className="ent-empty">
                <div className="ent-empty-icon">
                  <PhoneCall size={26} strokeWidth={1.75} />
                </div>
                <div style={{ fontWeight: 600 }}>No emergency contact on file</div>
              </div>
            )}
          </div>
        </Tab>

        <Tab eventKey="schedule" title="Work Schedule">
          <div className="ent-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="ent-profile-section-title mb-0">
                <CalendarClock size={16} strokeWidth={2.25} />
                Work Schedule
              </h6>

              {canUpdateSchedule && (
                <Button className="ent-btn-primary" size="sm" onClick={() => setAssignShow(true)}>
                  <Plus size={14} strokeWidth={2} className="me-1" />
                  Assign Schedule
                </Button>
              )}
            </div>

            {assignments.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">
                  <CalendarClock size={26} strokeWidth={1.75} />
                </div>
                <div style={{ fontWeight: 600 }}>No work schedule assigned yet</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  QR check-in requires an active schedule to work.
                </div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Schedule</th>
                    <th>Effective Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    {canUpdateSchedule && <th style={{ width: 70 }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => {
                    const st = scheduleStatus(a);
                    return (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600 }}>{a.workScheduleName}</td>
                        <td>{a.effectiveDate}</td>
                        <td>{a.endDate || '—'}</td>
                        <td><span className={`ent-pill ${st.pill}`}>{st.label}</span></td>
                        {canUpdateSchedule && (
                          <td className="text-end">
                            <Button
                              variant="light"
                              size="sm"
                              className="border-0 text-danger"
                              onClick={() => setRemoveTarget(a)}
                            >
                              <Trash2 size={14} strokeWidth={2} />
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        </Tab>
      </Tabs>

      {/* MODALS */}
      <ChangeStatusModal
        show={statusShow}
        submitting={statusSubmitting}
        employee={employee}
        onClose={() => setStatusShow(false)}
        onSubmit={handleChangeStatus}
      />

      <LinkAccountModal
        show={linkShow}
        submitting={linkSubmitting}
        onClose={() => setLinkShow(false)}
        onSubmit={handleLinkAccount}
      />

      <AssignScheduleModal
        show={assignShow}
        schedules={schedules}
        submitting={assignSubmitting}
        onClose={() => setAssignShow(false)}
        onSubmit={handleAssignSchedule}
      />

      <ConfirmModal
        show={!!removeTarget}
        title="Remove Work Schedule"
        body={`តើអ្នកប្រាកដថាចង់លុបការចាត់តាំង "${removeTarget?.workScheduleName}" មែនទេ?`}
        confirming={removing}
        onConfirm={handleRemoveAssignment}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}

export default EmployeeProfile;