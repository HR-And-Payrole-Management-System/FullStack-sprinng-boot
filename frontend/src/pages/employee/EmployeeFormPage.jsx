import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, Tab, Form, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { UserRound, Briefcase, Building2, ShieldAlert } from 'lucide-react';

import { employeeService } from '../../services/employee.service';
import { companyService } from '../../services/company.service';
import { branchApi } from '../../api/branch.api';
import { departmentApi } from '../../api/department.api';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { positionApi } from '../../api/position.api';
import { employeeApi } from '../../api/employee.api';

function TabLabel({ icon: Icon, label }) {
  return (
    <span className="d-flex align-items-center gap-2">
      <Icon size={15} strokeWidth={2.25} />
      {label}
    </span>
  );
}

function EmployeeFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [managers, setManagers] = useState([]);

  // Holds the branch/position saved on the employee until their option
  // lists (which load asynchronously based on company/department) are ready.
  const pendingBranchId = useRef(null);
  const pendingPositionId = useRef(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      employeeCode: '', firstName: '', lastName: '', email: '', phone: '',
      dateOfBirth: '', gender: '', hireDate: '', address: '',
      employmentType: 'FULL_TIME', probationEndDate: '', contractStartDate: '', contractEndDate: '',
      companyId: '', branchId: '', departmentId: '', positionId: '', managerId: '',
      contactName: '', relationship: '', contactPhone: '', contactEmail: '', contactAddress: '',
    },
  });

  const companyId = watch('companyId');
  const departmentId = watch('departmentId');

  useEffect(() => {
    if (!departmentId) { setPositions([]); return; }
    positionApi.getByDepartmentId(departmentId).then((res) => {
      setPositions(res.data || []);
      if (pendingPositionId.current != null) {
        setValue('positionId', String(pendingPositionId.current));
        pendingPositionId.current = null;
      }
    });
  }, [departmentId, setValue]);

  useEffect(() => {
    companyService.list().then(setCompanies);
  }, []);

  useEffect(() => {
    if (!companyId) { setBranches([]); return; }
    branchApi.getByCompanyId(companyId).then((res) => {
      setBranches(res.data || []);
      if (pendingBranchId.current != null) {
        setValue('branchId', String(pendingBranchId.current));
        pendingBranchId.current = null;
      }
    });
  }, [companyId, setValue]);


  useEffect(() => {
    departmentApi.getAll().then((res) => setDepartments(res.data || []));
  }, []);
  useEffect(() => {
  employeeApi.getAll({ page: 0, size: 1000 }).then((res) => {
    setManagers(res.data.content.filter((e) => e.id !== Number(id)));
  });
}, [id]);

  useEffect(() => {
    if (isEdit) {
      Promise.all([employeeService.get(id), employeeService.getEmergencyContact(id)]).then(([emp, contact]) => {
        // Branch/Position options aren't loaded yet at this point (they depend
        // on company/department), so stash the target ids and apply them once
        // their dropdowns actually populate — see the branch/position effects.
        pendingBranchId.current = emp.branchId ?? '';
        pendingPositionId.current = emp.positionId ?? '';
        reset({
          ...emp,
          contactName: contact?.contactName || '',
          relationship: contact?.relationship || '',
          contactPhone: contact?.phone || '',
          contactEmail: contact?.email || '',
          contactAddress: contact?.address || '',
        });
        setLoading(false);
      });
    }
  }, [isEdit, id, reset]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const basic = {
        employeeCode: values.employeeCode, firstName: values.firstName, lastName: values.lastName,
        email: values.email, phone: values.phone, dateOfBirth: values.dateOfBirth || null,
        gender: values.gender, hireDate: values.hireDate, address: values.address,
      };
      const employment = {
        employmentType: values.employmentType,
        probationEndDate: values.probationEndDate || null,
        contractStartDate: values.contractStartDate || null,
        contractEndDate: values.contractEndDate || null,
      };

      // NEW — if the user picked ANY organization field, require all four before
      // saving, instead of silently skipping the whole assignment.
      const orgFieldsTouched = values.companyId || values.branchId || values.departmentId || values.positionId;
      const orgFieldsComplete = values.companyId && values.branchId && values.departmentId && values.positionId;

      if (orgFieldsTouched && !orgFieldsComplete) {
        showToast('សូមជ្រើសរើស ក្រុមហ៊ុន សាខា នាយកដ្ឋាន និងតួនាទី ឲ្យគ្រប់ ដើម្បីរក្សាទុកព័ត៌មានអង្គភាព', 'warning');
        setSubmitting(false);
        return; // stop here — don't save basic info while silently dropping organization
      }

      const organization = orgFieldsComplete
        ? { companyId: Number(values.companyId), branchId: Number(values.branchId), departmentId: Number(values.departmentId), positionId: Number(values.positionId) }
        : null;

      const employee = isEdit
        ? await employeeService.updateFull(id, { basic, employment, organization })
        : await employeeService.createFull({ basic, employment, organization });

      if (values.contactName) {
        await employeeService.saveEmergencyContact(employee.id, {
          contactName: values.contactName, relationship: values.relationship,
          phone: values.contactPhone, email: values.contactEmail, address: values.contactAddress,
        });
      }

      showToast(isEdit ? 'កែប្រែបុគ្គលិកជោគជ័យ' : 'បង្កើតបុគ្គលិកជោគជ័យ', 'success');
      navigate(`/employee/${employee.id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'មានបញ្ហា សូមព្យាយាមម្តងទៀត', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="ent-page-title mb-3">{isEdit ? 'Edit Employee' : 'New Employee'}</div>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="ent-card p-4">
          <Tabs defaultActiveKey="basic" className="ent-profile-tabs mb-4">
            <Tab eventKey="basic" title={<TabLabel icon={UserRound} label="Basic Info" />}>
              <Row className="g-3 pt-3">
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Employee Code *</Form.Label><Form.Control {...register('employeeCode', { required: true })} isInvalid={!!errors.employeeCode} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">First Name *</Form.Label><Form.Control {...register('firstName', { required: true })} isInvalid={!!errors.firstName} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Last Name *</Form.Label><Form.Control {...register('lastName', { required: true })} isInvalid={!!errors.lastName} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Email *</Form.Label><Form.Control type="email" {...register('email', { required: true })} isInvalid={!!errors.email} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Phone</Form.Label><Form.Control {...register('phone')} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Gender</Form.Label>
                  <Form.Select {...register('gender')}><option value="">--</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option></Form.Select>
                </Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Date of Birth</Form.Label><Form.Control type="date" {...register('dateOfBirth')} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Hire Date *</Form.Label><Form.Control type="date" {...register('hireDate', { required: true })} isInvalid={!!errors.hireDate} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Address</Form.Label><Form.Control {...register('address')} /></Form.Group></Col>
              </Row>
            </Tab>

            <Tab eventKey="employment" title={<TabLabel icon={Briefcase} label="Employment" />}>
              <Row className="g-3 pt-3">
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Employment Type *</Form.Label>
                  <Form.Select {...register('employmentType', { required: true })}>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERN">Intern</option>
                  </Form.Select>
                </Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Probation End Date</Form.Label><Form.Control type="date" {...register('probationEndDate')} /></Form.Group></Col>
                <Col md={4}></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Contract Start</Form.Label><Form.Control type="date" {...register('contractStartDate')} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Contract End</Form.Label><Form.Control type="date" {...register('contractEndDate')} /></Form.Group></Col>
              </Row>
            </Tab>

            <Tab eventKey="organization" title={<TabLabel icon={Building2} label="Organization" />}>
              <Row className="g-3 pt-3">
                <Col md={3}><Form.Group><Form.Label className="small fw-semibold">Company</Form.Label>
                  <Form.Select {...register('companyId')}>
                    <option value="">--</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Form.Select>
                </Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label className="small fw-semibold">Branch</Form.Label>
                  <Form.Select {...register('branchId')} disabled={!companyId}>
                    <option value="">--</option>
                    {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </Form.Select>
                </Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label className="small fw-semibold">Department</Form.Label>
                  <Form.Select {...register('departmentId')}>
                    <option value="">--</option>
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </Form.Select>
                </Form.Group></Col>
                <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Position</Form.Label>
                  <Form.Select {...register('positionId')} disabled={!departmentId}>
                    <option value="">-- Select Position --</option>
                    {positions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} {p.level ? `(${p.level})` : ''}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Manager</Form.Label>
                  <Form.Select {...register('managerId')}>
                    <option value="">-- No Manager --</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              </Row>
              </Tab>

            <Tab eventKey="emergency" title={<TabLabel icon={ShieldAlert} label="Emergency Contact" />}>
              <Row className="g-3 pt-3">
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Contact Name</Form.Label><Form.Control {...register('contactName')} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Relationship</Form.Label><Form.Control {...register('relationship')} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Phone</Form.Label><Form.Control {...register('contactPhone')} /></Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label className="small fw-semibold">Email</Form.Label><Form.Control {...register('contactEmail')} /></Form.Group></Col>
                <Col md={8}><Form.Group><Form.Label className="small fw-semibold">Address</Form.Label><Form.Control {...register('contactAddress')} /></Form.Group></Col>
              </Row>
            </Tab>
          </Tabs>

          <div className="d-flex justify-content-end gap-2 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
            <Button className="ent-btn-secondary" onClick={() => navigate('/employee')} disabled={submitting}>Cancel</Button>
            <Button type="submit" className="ent-btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default EmployeeFormPage;