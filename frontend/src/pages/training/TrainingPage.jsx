import { useEffect, useState, useMemo } from 'react';
import { Tabs, Tab, Table, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';

import { trainingProgramService } from '../../services/trainingProgram.service';
import { trainingEnrollmentService } from '../../services/trainingEnrollment.service';
import { employeeService } from '../../services/employee.service';
import { useHasPermission } from '../../hooks/useHaspermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import TrainingProgramFormModal from './TrainingProgramFormModal';
import EnrollEmployeeModal from './EnrollEmployeeModal';
import UpdateEnrollmentModal from './UpdateEnrollmentModal';

function statusPillClass(status) {
  if (status === 'COMPLETED') return 'ent-pill-success';
  if (status === 'CANCELLED') return 'ent-pill-danger';
  if (status === 'IN_PROGRESS') return 'ent-pill-warning';
  return 'ent-pill-neutral';
}

function TrainingPage() {
  const { showToast } = useToast();

  const canCreate = useHasPermission('TRAINING_CREATE');
  const canUpdate = useHasPermission('TRAINING_UPDATE');
  const canDelete = useHasPermission('TRAINING_DELETE');

  const [programs, setPrograms] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [programSearch, setProgramSearch] = useState('');
  const [enrollmentSearch, setEnrollmentSearch] = useState('');

  const [programFormShow, setProgramFormShow] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [programSubmitting, setProgramSubmitting] = useState(false);
  const [deleteProgramTarget, setDeleteProgramTarget] = useState(null);

  const [enrollFormShow, setEnrollFormShow] = useState(false);
  const [enrollSubmitting, setEnrollSubmitting] = useState(false);

  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [updateEnrollmentShow, setUpdateEnrollmentShow] = useState(false);
  const [enrollmentUpdateSubmitting, setEnrollmentUpdateSubmitting] = useState(false);
  const [deleteEnrollmentTarget, setDeleteEnrollmentTarget] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      trainingProgramService.list(),
      trainingEnrollmentService.list(),
      employeeService.list({ size: 1000 }),
    ])
      .then(([p, e, empPage]) => {
        setPrograms(p);
        setEnrollments(e);
        setEmployees(empPage?.content || []);
      })
      .catch(() => showToast('Unable to load training data.', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // ---------- Programs ----------
  const filteredPrograms = useMemo(() => {
    const q = programSearch.trim().toLowerCase();
    if (!q) return programs;
    return programs.filter((p) => p.title?.toLowerCase().includes(q) || p.provider?.toLowerCase().includes(q));
  }, [programs, programSearch]);

  const openProgramCreate = () => { setEditingProgram(null); setProgramFormShow(true); };
  const openProgramEdit = (p) => { setEditingProgram(p); setProgramFormShow(true); };

  const handleProgramSubmit = async (values) => {
    setProgramSubmitting(true);
    try {
      if (editingProgram) {
        await trainingProgramService.update(editingProgram.id, values);
        showToast('Training program updated successfully.', 'success');
      } else {
        await trainingProgramService.create(values);
        showToast('Training program created successfully.', 'success');
      }
      setProgramFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'danger');
    } finally {
      setProgramSubmitting(false);
    }
  };

  const handleProgramDelete = async () => {
    setDeleting(true);
    try {
      await trainingProgramService.remove(deleteProgramTarget.id);
      showToast('Training program deleted successfully.', 'success');
      setDeleteProgramTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to delete this program.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  // ---------- Enrollments ----------
  const filteredEnrollments = useMemo(() => {
    const q = enrollmentSearch.trim().toLowerCase();
    if (!q) return enrollments;
    return enrollments.filter(
      (e) => e.employeeName?.toLowerCase().includes(q) || e.trainingProgramTitle?.toLowerCase().includes(q)
    );
  }, [enrollments, enrollmentSearch]);

  const handleEnrollSubmit = async (values) => {
    setEnrollSubmitting(true);
    try {
      await trainingEnrollmentService.create(values);
      showToast('Employee enrolled successfully.', 'success');
      setEnrollFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'danger');
    } finally {
      setEnrollSubmitting(false);
    }
  };

  const openUpdateEnrollment = (e) => { setEditingEnrollment(e); setUpdateEnrollmentShow(true); };

  const handleEnrollmentUpdate = async (values) => {
    setEnrollmentUpdateSubmitting(true);
    try {
      await trainingEnrollmentService.update(editingEnrollment.id, values);
      showToast('Enrollment updated successfully.', 'success');
      setUpdateEnrollmentShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'danger');
    } finally {
      setEnrollmentUpdateSubmitting(false);
    }
  };

  const handleEnrollmentDelete = async () => {
    setDeleting(true);
    try {
      await trainingEnrollmentService.remove(deleteEnrollmentTarget.id);
      showToast('Enrollment deleted successfully.', 'success');
      setDeleteEnrollmentTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to delete this enrollment.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  // ---------- Stats ----------
  const activePrograms = programs.filter((p) => p.status === 'ACTIVE').length;
  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;

  const byStatus = useMemo(() => {
    const map = {};
    enrollments.forEach((e) => { map[e.status] = (map[e.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  }, [enrollments]);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">Training &amp; Development</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Training programs and employee enrollments
          </div>
        </div>
      </div>

      <Row className="g-3 mb-3">
        <Col md={3}>
          <TrendStatCard label="Active Programs" value={activePrograms} icon="🎓" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Total Programs" value={programs.length} icon="📚" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Total Enrollments" value={enrollments.length} icon="🧑‍🎓" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Completed" value={completedCount} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
      </Row>

      <Tabs defaultActiveKey="programs" className="mb-3">
        {/* ---------------- PROGRAMS TAB ---------------- */}
        <Tab eventKey="programs" title="Programs">
          <div className="ent-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="ent-search" style={{ maxWidth: '300px' }}>
                <span className="ent-search-icon">🔍</span>
                <Form.Control
                  placeholder="Search title or provider..."
                  value={programSearch}
                  onChange={(e) => setProgramSearch(e.target.value)}
                />
              </div>
              {canCreate && <Button className="ent-btn-primary" onClick={openProgramCreate}>+ New Program</Button>}
            </div>

            {filteredPrograms.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">🎓</div>
                <div style={{ fontWeight: 600 }}>No training programs found</div>
                <div className="small">Add your first training program.</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Provider</th>
                    <th>Duration</th>
                    <th>Enrollments</th>
                    <th>Completed</th>
                    <th>Status</th>
                    <th style={{ width: '70px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrograms.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.title}</td>
                      <td>{p.provider || '—'}</td>
                      <td>{p.durationHours ? `${p.durationHours}h` : '—'}</td>
                      <td>{p.enrollmentCount}</td>
                      <td>{p.completedCount}</td>
                      <td><span className={`ent-pill ${p.status === 'ACTIVE' ? 'ent-pill-success' : 'ent-pill-neutral'}`}>{p.status}</span></td>
                      <td className="text-end">
                        {(canUpdate || canDelete) ? (
                          <Dropdown align="end">
                            <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                            <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                              {canUpdate && <Dropdown.Item onClick={() => openProgramEdit(p)}>Edit</Dropdown.Item>}
                              {canDelete && <Dropdown.Item className="text-danger" onClick={() => setDeleteProgramTarget(p)}>Delete</Dropdown.Item>}
                            </Dropdown.Menu>
                          </Dropdown>
                        ) : <span className="text-muted">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Tab>

        {/* ---------------- ENROLLMENTS TAB ---------------- */}
        <Tab eventKey="enrollments" title="Enrollments">
          <Row className="g-3 mb-3">
            <Col md={4}>
              <DonutChart data={byStatus} title="Enrollments by Status" centerLabel="Total" />
            </Col>
            <Col md={8}>
              <div className="ent-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="ent-search" style={{ maxWidth: '300px' }}>
                    <span className="ent-search-icon">🔍</span>
                    <Form.Control
                      placeholder="Search employee or program..."
                      value={enrollmentSearch}
                      onChange={(e) => setEnrollmentSearch(e.target.value)}
                    />
                  </div>
                  {canCreate && <Button className="ent-btn-primary" onClick={() => setEnrollFormShow(true)}>+ Enroll Employee</Button>}
                </div>

                {filteredEnrollments.length === 0 ? (
                  <div className="ent-empty">
                    <div className="ent-empty-icon">🧑‍🎓</div>
                    <div style={{ fontWeight: 600 }}>No enrollments found</div>
                    <div className="small">Enroll an employee in a training program to get started.</div>
                  </div>
                ) : (
                  <Table responsive className="ent-table mb-0">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Program</th>
                        <th>Enrolled</th>
                        <th>Score</th>
                        <th>Status</th>
                        <th style={{ width: '70px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnrollments.map((e) => (
                        <tr key={e.id}>
                          <td style={{ fontWeight: 600 }}>{e.employeeName}</td>
                          <td>{e.trainingProgramTitle}</td>
                          <td>{e.enrolledDate}</td>
                          <td>{e.score != null ? e.score : '—'}</td>
                          <td><span className={`ent-pill ${statusPillClass(e.status)}`}>{e.status?.replace('_', ' ')}</span></td>
                          <td className="text-end">
                            {(canUpdate || canDelete) ? (
                              <Dropdown align="end">
                                <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                                <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                                  {canUpdate && <Dropdown.Item onClick={() => openUpdateEnrollment(e)}>Update</Dropdown.Item>}
                                  {canDelete && <Dropdown.Item className="text-danger" onClick={() => setDeleteEnrollmentTarget(e)}>Delete</Dropdown.Item>}
                                </Dropdown.Menu>
                              </Dropdown>
                            ) : <span className="text-muted">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      <TrainingProgramFormModal
        show={programFormShow}
        initialData={editingProgram}
        submitting={programSubmitting}
        onClose={() => setProgramFormShow(false)}
        onSubmit={handleProgramSubmit}
      />
      <EnrollEmployeeModal
        show={enrollFormShow}
        employees={employees}
        programs={programs}
        submitting={enrollSubmitting}
        onClose={() => setEnrollFormShow(false)}
        onSubmit={handleEnrollSubmit}
      />
      <UpdateEnrollmentModal
        show={updateEnrollmentShow}
        enrollment={editingEnrollment}
        submitting={enrollmentUpdateSubmitting}
        onClose={() => setUpdateEnrollmentShow(false)}
        onSubmit={handleEnrollmentUpdate}
      />

      <ConfirmModal
        show={!!deleteProgramTarget}
        title="Delete Training Program"
        body={`Are you sure you want to delete "${deleteProgramTarget?.title}"?`}
        confirming={deleting}
        onConfirm={handleProgramDelete}
        onCancel={() => setDeleteProgramTarget(null)}
      />
      <ConfirmModal
        show={!!deleteEnrollmentTarget}
        title="Delete Enrollment"
        body="Are you sure you want to delete this enrollment?"
        confirming={deleting}
        onConfirm={handleEnrollmentDelete}
        onCancel={() => setDeleteEnrollmentTarget(null)}
      />
    </div>
  );
}

export default TrainingPage;