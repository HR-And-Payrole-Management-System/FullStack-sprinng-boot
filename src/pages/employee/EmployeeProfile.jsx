// EmployeeProfile.jsx

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Tabs, Tab } from 'react-bootstrap';

import { employeeService } from '../../services/employee.service';
import { useHasPermission } from '../../hooks/useHasPermission';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { resolveUploadUrl } from '../../utils/url';

import LoadingSpinner from '../../components/LoadingSpinner';
import ChangeStatusModal from '../../components/ChangeStatusModal';
import LinkAccountModal from '../../components/LinkAccountModal';

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

// -------------------- COMPONENT --------------------

function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const canUpdate = useHasPermission('EMPLOYEE_UPDATE');
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

  // -------------------- LOAD DATA --------------------

  useEffect(() => {
    setLoading(true);

    Promise.all([
      employeeService.get(id),
      employeeService.getEmergencyContact(id),
    ])
      .then(([e, c]) => {
        setEmployee(e);
        setContact(c);
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

  // -------------------- UI --------------------

  if (loading) return <LoadingSpinner fullPage />;
  if (!employee) return <div className="ent-empty">Employee not found</div>;

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
                <span className="ent-pill ent-pill-success">
                  🔗 {employee.linkedUserEmail}
                </span>
                <Button variant="light" size="sm" onClick={handleUnlink}>
                  Unlink
                </Button>
              </>
            ) : (
              <Button variant="light" size="sm" onClick={() => setLinkShow(true)}>
                Link Account
              </Button>
            )}

            <Button variant="light" size="sm" onClick={() => setStatusShow(true)}>
              Change Status
            </Button>

            {canUpdate && (
              <Button size="sm" onClick={() => navigate(`/employee/${id}/edit`)}>
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
                <h6 className="mb-3">Basic Info</h6>
                <Field label="Code" value={employee.employeeCode} />
                <Field label="Email" value={employee.email} />
                <Field label="Phone" value={employee.phone} />
              </div>
            </Col>

            <Col md={6}>
              <div className="ent-card p-4">
                <h6 className="mb-3">Organization</h6>
                <Field label="Company" value={employee.companyName} />
                <Field label="Department" value={employee.departmentName} />
                <Field label="Position" value={employee.positionName} />
              </div>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="emergency" title="Emergency Contact">
          <div className="ent-card p-4">
            {contact ? (
              <Row>
                <Col md={4}><Field label="Name" value={contact.contactName} /></Col>
                <Col md={4}><Field label="Phone" value={contact.phone} /></Col>
                <Col md={4}><Field label="Relation" value={contact.relationship} /></Col>
              </Row>
            ) : (
              <div className="ent-empty">No emergency contact on file</div>
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
    </div>
  );
}

export default EmployeeProfile;