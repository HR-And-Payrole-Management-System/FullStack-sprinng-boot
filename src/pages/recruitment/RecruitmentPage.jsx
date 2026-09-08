import { useEffect, useState, useMemo } from 'react';
import { Tabs, Tab, Table, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';

import { jobPostingService } from '../../services/jobPosting.service';
import { candidateService } from '../../services/candidate.service';
import { applicationService } from '../../services/application.service';
import { departmentService } from '../../services/department.service';
import { positionService } from '../../services/position.service';
import { useHasPermission } from '../../hooks/useHaspermission';
import { useToast } from '../../context/ToastContext';

import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import JobPostingFormModal from './JobPostingFormModal';
import CandidateFormModal from './CandidateFormModal';
import ApplicationFormModal from './ApplicationFormModal';

const STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];
const TERMINAL_STAGES = ['HIRED', 'REJECTED'];

function stagePillClass(stage) {
  if (stage === 'HIRED') return 'ent-pill-success';
  if (stage === 'REJECTED') return 'ent-pill-danger';
  if (stage === 'OFFER' || stage === 'INTERVIEW') return 'ent-pill-warning';
  return 'ent-pill-neutral';
}

function postingStatusPillClass(status) {
  if (status === 'OPEN') return 'ent-pill-success';
  if (status === 'CLOSED') return 'ent-pill-neutral';
  if (status === 'ON_HOLD') return 'ent-pill-warning';
  return 'ent-pill-neutral';
}

function RecruitmentPage() {
  const { showToast } = useToast();

  const canCreate = useHasPermission('RECRUITMENT_CREATE');
  const canUpdate = useHasPermission('RECRUITMENT_UPDATE');
  const canDelete = useHasPermission('RECRUITMENT_DELETE');

  const [postings, setPostings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [postingSearch, setPostingSearch] = useState('');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [applicationSearch, setApplicationSearch] = useState('');

  const [postingFormShow, setPostingFormShow] = useState(false);
  const [editingPosting, setEditingPosting] = useState(null);
  const [postingSubmitting, setPostingSubmitting] = useState(false);
  const [deletePostingTarget, setDeletePostingTarget] = useState(null);

  const [candidateFormShow, setCandidateFormShow] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [candidateSubmitting, setCandidateSubmitting] = useState(false);
  const [deleteCandidateTarget, setDeleteCandidateTarget] = useState(null);

  const [applicationFormShow, setApplicationFormShow] = useState(false);
  const [applicationSubmitting, setApplicationSubmitting] = useState(false);
  const [deleteApplicationTarget, setDeleteApplicationTarget] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      jobPostingService.list(),
      candidateService.list(),
      applicationService.list(),
      departmentService.list(),
      positionService.list(),
    ])
      .then(([p, c, a, d, pos]) => {
        setPostings(p); setCandidates(c); setApplications(a);
        setDepartments(d); setPositions(pos);
      })
      .catch(() => showToast('Unable to load recruitment data.', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // ---------- Postings ----------
  const filteredPostings = useMemo(() => {
    const q = postingSearch.trim().toLowerCase();
    if (!q) return postings;
    return postings.filter((p) => p.title?.toLowerCase().includes(q) || p.departmentName?.toLowerCase().includes(q));
  }, [postings, postingSearch]);

  const openPostingCreate = () => { setEditingPosting(null); setPostingFormShow(true); };
  const openPostingEdit = (p) => { setEditingPosting(p); setPostingFormShow(true); };

  const handlePostingSubmit = async (values) => {
    setPostingSubmitting(true);
    try {
      if (editingPosting) {
        await jobPostingService.update(editingPosting.id, values);
        showToast('Job posting updated successfully.', 'success');
      } else {
        await jobPostingService.create(values);
        showToast('Job posting created successfully.', 'success');
      }
      setPostingFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'danger');
    } finally {
      setPostingSubmitting(false);
    }
  };

  const handlePostingDelete = async () => {
    setDeleting(true);
    try {
      await jobPostingService.remove(deletePostingTarget.id);
      showToast('Job posting deleted successfully.', 'success');
      setDeletePostingTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to delete this job posting.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  // ---------- Candidates ----------
  const filteredCandidates = useMemo(() => {
    const q = candidateSearch.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (c) => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
    );
  }, [candidates, candidateSearch]);

  const openCandidateCreate = () => { setEditingCandidate(null); setCandidateFormShow(true); };
  const openCandidateEdit = (c) => { setEditingCandidate(c); setCandidateFormShow(true); };

  const handleCandidateSubmit = async (values) => {
    setCandidateSubmitting(true);
    try {
      if (editingCandidate) {
        await candidateService.update(editingCandidate.id, values);
        showToast('Candidate updated successfully.', 'success');
      } else {
        await candidateService.create(values);
        showToast('Candidate added successfully.', 'success');
      }
      setCandidateFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'danger');
    } finally {
      setCandidateSubmitting(false);
    }
  };

  const handleCandidateDelete = async () => {
    setDeleting(true);
    try {
      await candidateService.remove(deleteCandidateTarget.id);
      showToast('Candidate deleted successfully.', 'success');
      setDeleteCandidateTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to delete this candidate.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  // ---------- Applications ----------
  const filteredApplications = useMemo(() => {
    const q = applicationSearch.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter(
      (a) => a.candidateName?.toLowerCase().includes(q) || a.jobPostingTitle?.toLowerCase().includes(q)
    );
  }, [applications, applicationSearch]);

  const handleApplicationSubmit = async (values) => {
    setApplicationSubmitting(true);
    try {
      await applicationService.create(values);
      showToast('Application recorded successfully.', 'success');
      setApplicationFormShow(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong.', 'danger');
    } finally {
      setApplicationSubmitting(false);
    }
  };

  const handleStageChange = async (application, stage) => {
    try {
      await applicationService.updateStage(application.id, { stage, notes: application.notes });
      showToast(`Moved to ${stage.replace('_', ' ')}.`, 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to update stage.', 'danger');
    }
  };

  const handleApplicationDelete = async () => {
    setDeleting(true);
    try {
      await applicationService.remove(deleteApplicationTarget.id);
      showToast('Application deleted successfully.', 'success');
      setDeleteApplicationTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to delete this application.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  // ---------- Stats ----------
  const openPostingsCount = postings.filter((p) => p.status === 'OPEN').length;
  const hiredCount = applications.filter((a) => a.stage === 'HIRED').length;

  const byStage = useMemo(() => {
    const map = {};
    applications.forEach((a) => { map[a.stage] = (map[a.stage] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  }, [applications]);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar">
        <div>
          <div className="ent-page-title">Recruitment</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Job postings, candidates, and applications
          </div>
        </div>
      </div>

      <Row className="g-3 mb-3">
        <Col md={3}>
          <TrendStatCard label="Open Postings" value={openPostingsCount} icon="📢" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Total Candidates" value={candidates.length} icon="🧑‍💼" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Total Applications" value={applications.length} icon="📄" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Hired" value={hiredCount} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
      </Row>

      <Tabs defaultActiveKey="postings" className="mb-3">
        {/* ---------------- POSTINGS TAB ---------------- */}
        <Tab eventKey="postings" title="Job Postings">
          <div className="ent-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="ent-search" style={{ maxWidth: '300px' }}>
                <span className="ent-search-icon">🔍</span>
                <Form.Control
                  placeholder="Search title or department..."
                  value={postingSearch}
                  onChange={(e) => setPostingSearch(e.target.value)}
                />
              </div>
              {canCreate && <Button className="ent-btn-primary" onClick={openPostingCreate}>+ New Posting</Button>}
            </div>

            {filteredPostings.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">📢</div>
                <div style={{ fontWeight: 600 }}>No job postings found</div>
                <div className="small">Add your first job posting to start recruiting.</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Openings</th>
                    <th>Applications</th>
                    <th>Hired</th>
                    <th>Status</th>
                    <th style={{ width: '70px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPostings.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.title}</td>
                      <td>{p.departmentName}</td>
                      <td>{p.employmentType?.replace('_', ' ')}</td>
                      <td>{p.openings}</td>
                      <td>{p.applicationCount}</td>
                      <td>{p.hiredCount}</td>
                      <td><span className={`ent-pill ${postingStatusPillClass(p.status)}`}>{p.status?.replace('_', ' ')}</span></td>
                      <td className="text-end">
                        {(canUpdate || canDelete) ? (
                          <Dropdown align="end">
                            <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                            <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                              {canUpdate && <Dropdown.Item onClick={() => openPostingEdit(p)}>Edit</Dropdown.Item>}
                              {canDelete && <Dropdown.Item className="text-danger" onClick={() => setDeletePostingTarget(p)}>Delete</Dropdown.Item>}
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

        {/* ---------------- CANDIDATES TAB ---------------- */}
        <Tab eventKey="candidates" title="Candidates">
          <div className="ent-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="ent-search" style={{ maxWidth: '300px' }}>
                <span className="ent-search-icon">🔍</span>
                <Form.Control
                  placeholder="Search name or email..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                />
              </div>
              {canCreate && <Button className="ent-btn-primary" onClick={openCandidateCreate}>+ Add Candidate</Button>}
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="ent-empty">
                <div className="ent-empty-icon">🧑‍💼</div>
                <div style={{ fontWeight: 600 }}>No candidates found</div>
                <div className="small">Add candidates to your talent pool.</div>
              </div>
            ) : (
              <Table responsive className="ent-table mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Source</th>
                    <th>Applications</th>
                    <th style={{ width: '70px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</td>
                      <td>{c.email}</td>
                      <td>{c.phone || '—'}</td>
                      <td>{c.source ? <span className="ent-pill ent-pill-neutral">{c.source.replace('_', ' ')}</span> : '—'}</td>
                      <td>{c.applicationCount}</td>
                      <td className="text-end">
                        {(canUpdate || canDelete) ? (
                          <Dropdown align="end">
                            <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                            <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                              {canUpdate && <Dropdown.Item onClick={() => openCandidateEdit(c)}>Edit</Dropdown.Item>}
                              {canDelete && <Dropdown.Item className="text-danger" onClick={() => setDeleteCandidateTarget(c)}>Delete</Dropdown.Item>}
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

        {/* ---------------- APPLICATIONS TAB ---------------- */}
        <Tab eventKey="applications" title="Applications">
          <Row className="g-3 mb-3">
            <Col md={4}>
              <DonutChart data={byStage} title="Applications by Stage" centerLabel="Total" />
            </Col>
            <Col md={8}>
              <div className="ent-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="ent-search" style={{ maxWidth: '300px' }}>
                    <span className="ent-search-icon">🔍</span>
                    <Form.Control
                      placeholder="Search candidate or posting..."
                      value={applicationSearch}
                      onChange={(e) => setApplicationSearch(e.target.value)}
                    />
                  </div>
                  {canCreate && <Button className="ent-btn-primary" onClick={() => setApplicationFormShow(true)}>+ New Application</Button>}
                </div>

                {filteredApplications.length === 0 ? (
                  <div className="ent-empty">
                    <div className="ent-empty-icon">📄</div>
                    <div style={{ fontWeight: 600 }}>No applications found</div>
                    <div className="small">Applications will show up here once candidates apply.</div>
                  </div>
                ) : (
                  <Table responsive className="ent-table mb-0">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Job Posting</th>
                        <th>Applied</th>
                        <th>Stage</th>
                        <th style={{ width: '70px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map((a) => {
                        const isTerminal = TERMINAL_STAGES.includes(a.stage);
                        const canAdvance = canUpdate && !isTerminal;
                        return (
                          <tr key={a.id}>
                            <td style={{ fontWeight: 600 }}>{a.candidateName}</td>
                            <td>{a.jobPostingTitle}</td>
                            <td>{a.appliedDate}</td>
                            <td><span className={`ent-pill ${stagePillClass(a.stage)}`}>{a.stage?.replace('_', ' ')}</span></td>
                            <td className="text-end">
                              {(canAdvance || canDelete) ? (
                                <Dropdown align="end">
                                  <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                                  <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                                    {canAdvance && STAGES.filter((s) => s !== a.stage).map((s) => (
                                      <Dropdown.Item key={s} onClick={() => handleStageChange(a, s)}>
                                        Move to {s.replace('_', ' ')}
                                      </Dropdown.Item>
                                    ))}
                                    {canDelete && (
                                      <Dropdown.Item className="text-danger" onClick={() => setDeleteApplicationTarget(a)}>
                                        Delete
                                      </Dropdown.Item>
                                    )}
                                  </Dropdown.Menu>
                                </Dropdown>
                              ) : <span className="text-muted">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </div>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      <JobPostingFormModal
        show={postingFormShow}
        initialData={editingPosting}
        departments={departments}
        positions={positions}
        submitting={postingSubmitting}
        onClose={() => setPostingFormShow(false)}
        onSubmit={handlePostingSubmit}
      />
      <CandidateFormModal
        show={candidateFormShow}
        initialData={editingCandidate}
        submitting={candidateSubmitting}
        onClose={() => setCandidateFormShow(false)}
        onSubmit={handleCandidateSubmit}
      />
      <ApplicationFormModal
        show={applicationFormShow}
        candidates={candidates}
        postings={postings}
        submitting={applicationSubmitting}
        onClose={() => setApplicationFormShow(false)}
        onSubmit={handleApplicationSubmit}
      />

      <ConfirmModal
        show={!!deletePostingTarget}
        title="Delete Job Posting"
        body={`Are you sure you want to delete "${deletePostingTarget?.title}"?`}
        confirming={deleting}
        onConfirm={handlePostingDelete}
        onCancel={() => setDeletePostingTarget(null)}
      />
      <ConfirmModal
        show={!!deleteCandidateTarget}
        title="Delete Candidate"
        body={`Are you sure you want to delete "${deleteCandidateTarget?.firstName} ${deleteCandidateTarget?.lastName}"?`}
        confirming={deleting}
        onConfirm={handleCandidateDelete}
        onCancel={() => setDeleteCandidateTarget(null)}
      />
      <ConfirmModal
        show={!!deleteApplicationTarget}
        title="Delete Application"
        body="Are you sure you want to delete this application?"
        confirming={deleting}
        onConfirm={handleApplicationDelete}
        onCancel={() => setDeleteApplicationTarget(null)}
      />
    </div>
  );
}

export default RecruitmentPage;