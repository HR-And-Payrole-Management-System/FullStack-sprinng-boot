import { useState } from 'react';
import { Table, Button, Row, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { employeeService } from '../../services/employee.service';
import { departmentService } from '../../services/department.service';
import { useHasPermission } from '../../hooks/useHasPermission';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useServerPagination } from '../../hooks/useServerPagination';
import { resolveUploadUrl } from '../../utils/url';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import ChangeStatusModal from '../../components/ChangeStatusModal';
import TrendStatCard from '../../components/charts/TrendStatCard';
import DonutChart from '../../components/charts/DonutChart';
import FilterBar from '../../components/charts/FilterBar';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import AppPagination from '../../components/AppPagination';

function initials(fn = '', ln = '') {
  return `${fn[0] || ''}${ln[0] || ''}`.toUpperCase();
}

const STATUS_OPTIONS = ['All', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'RESIGNED'];
const EMPLOYMENT_OPTIONS = ['All', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'];

function useDepartments() {
  const [departments, setDepartments] = useState([]);
  useState(() => {
    departmentService.list().then(setDepartments).catch(() => {});
  });
  return departments;
}

function EmployeeList() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const canCreate = useHasPermission('EMPLOYEE_CREATE');
  const canUpdate = useHasPermission('EMPLOYEE_UPDATE');
  const canDelete = useHasPermission('EMPLOYEE_DELETE');

  const [departments, setDepartments] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({ department: 'All', status: 'All', employmentType: 'All' });
  const [page, setPage] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  const debouncedKeyword = useDebounce(keyword, 400);

  useState(() => {
    departmentService.list().then(setDepartments).catch(() => {});
  });

  const dept = departments.find((d) => d.name === filters.department);

  const { pageData, loading, reload } = useServerPagination(
    employeeService.list,
    {
      page,
      size: 10,
      keyword: debouncedKeyword || undefined,
      departmentId: dept?.id,
      status: filters.status !== 'All' ? filters.status : undefined,
      employmentType: filters.employmentType !== 'All' ? filters.employmentType : undefined,
    },
    [page, debouncedKeyword, filters, departments]
  );

  const handleChangeStatus = async (values) => {
    setStatusSubmitting(true);
    try {
      await employeeService.changeStatus(statusTarget.id, values);
      showToast('ប្តូរ status ជោគជ័យ', 'success');
      setStatusTarget(null);
      reload();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចប្តូរ status បានទេ', 'danger');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeService.remove(deleteTarget.id);
      showToast('លុបបុគ្គលិកជោគជ័យ', 'success');
      setDeleteTarget(null);
      reload();
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចលុបបានទេ', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const statusChartData = STATUS_OPTIONS.slice(1)
    .map((s) => ({ name: s, value: pageData.content.filter((e) => e.status === s).length }))
    .filter((d) => d.value > 0);

  if (loading && pageData.content.length === 0) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Employees</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            {pageData.totalElements} total employees
          </div>
        </div>
        {canCreate && (
          <Button className="ent-btn-primary" onClick={() => navigate('/employee/new')}>+ New Employee</Button>
        )}
      </div>

      <Row className="g-3 mb-3">
        <Col md={3}>
          <TrendStatCard label="Total Employees" value={pageData.totalElements} icon="👥" iconBg="var(--color-primary-soft)" iconColor="var(--color-primary)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Active (this page)" value={pageData.content.filter((e) => e.status === 'ACTIVE').length} icon="✅" iconBg="var(--color-success-soft)" iconColor="var(--color-success)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Departments" value={departments.length} icon="🗂️" iconBg="var(--color-warning-soft)" iconColor="var(--color-warning)" />
        </Col>
        <Col md={3}>
          <TrendStatCard label="Current Page" value={`${pageData.page + 1} / ${pageData.totalPages || 1}`} icon="📄" iconBg="var(--color-danger-soft)" iconColor="var(--color-danger)" />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={4}>
          <DonutChart data={statusChartData} title="Status (this page)" centerLabel="Shown" height={200} />
        </Col>
        <Col md={8}>
          <div className="ent-card p-3 h-100">
            <SearchInput
              value={keyword}
              onChange={(val) => { setPage(0); setKeyword(val); }}
              placeholder="Search name, code, email..."
              style={{ maxWidth: '300px', marginBottom: '0.75rem' }}
            />
            <FilterBar
              filters={[
                { key: 'department', type: 'select', label: 'Department', options: ['All', ...departments.map((d) => d.name)] },
                { key: 'status', type: 'select', label: 'Status', options: STATUS_OPTIONS },
                { key: 'employmentType', type: 'select', label: 'Type', options: EMPLOYMENT_OPTIONS },
              ]}
              values={filters}
              onChange={(key, val) => { setPage(0); setFilters((f) => ({ ...f, [key]: val })); }}
            />
          </div>
        </Col>
      </Row>

      <div className="ent-card p-3">
        {pageData.content.length === 0 ? (
          <EmptyState icon="👥" title="No employees found" subtitle="Adjust filters, or add your first employee." />
        ) : (
          <>
            <Table responsive className="ent-table mb-3">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th style={{ width: '70px' }}></th>
                </tr>
              </thead>
              <tbody>
                {pageData.content.map((e) => (
                  <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/employee/${e.id}`)}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="ent-avatar-badge">
                            {e.photoUrl ? (
                              <img
                                src={resolveUploadUrl(e.photoUrl)}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                              />
                            ) : (
                              initials(e.firstName, e.lastName)
                            )}
                          </span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{e.firstName} {e.lastName}</div>
                          <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{e.employeeCode}</div>
                        </div>
                      </div>
                    </td>
                    <td>{e.departmentName || '—'}</td>
                    <td>{e.positionName || '—'}</td>
                    <td>{e.employmentType ? <span className="ent-pill ent-pill-neutral">{e.employmentType}</span> : '—'}</td>
                    <td>
                      <span className={`ent-pill ${e.status === 'ACTIVE' ? 'ent-pill-success' : e.status === 'SUSPENDED' ? 'ent-pill-warning' : 'ent-pill-neutral'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="text-end" onClick={(ev) => ev.stopPropagation()}>
                      <Dropdown align="end">
                        <Dropdown.Toggle size="sm" variant="light" className="border-0">⋮</Dropdown.Toggle>
                        <Dropdown.Menu renderOnMount popperConfig={{ strategy: 'fixed' }}>
                          <Dropdown.Item onClick={() => navigate(`/employee/${e.id}`)}>View Profile</Dropdown.Item>
                          <Dropdown.Item onClick={() => setStatusTarget(e)}>Change Status</Dropdown.Item>
                          {canUpdate && (
                            <Dropdown.Item onClick={() => navigate(`/employee/${e.id}/edit`)}>Edit</Dropdown.Item>
                          )}
                          {canDelete && (
                            <Dropdown.Item className="text-danger" onClick={() => setDeleteTarget(e)}>Delete</Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <AppPagination page={pageData.page} totalPages={pageData.totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <ChangeStatusModal
        show={!!statusTarget}
        employee={statusTarget}
        submitting={statusSubmitting}
        onClose={() => setStatusTarget(null)}
        onSubmit={handleChangeStatus}
      />

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Employee"
        body={`តើអ្នកប្រាកដថាចង់លុប "${deleteTarget?.firstName} ${deleteTarget?.lastName}" មែនទេ?`}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default EmployeeList;