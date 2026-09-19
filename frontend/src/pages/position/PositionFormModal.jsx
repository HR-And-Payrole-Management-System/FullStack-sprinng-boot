import { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { branchApi } from '../../api/branch.api';
import { departmentApi } from '../../api/department.api';

const LEVELS = ['EXECUTIVE', 'DIRECTOR', 'MANAGER', 'SUPERVISOR', 'SENIOR', 'STAFF', 'JUNIOR', 'INTERN'];

const schema = yup.object({
  name: yup.string().required('ត្រូវការឈ្មោះតួនាទី').max(100),
  description: yup.string().max(255).nullable(),
  companyId: yup.number().typeError('ត្រូវជ្រើសរើសក្រុមហ៊ុន').nullable(),
  branchId: yup.number().typeError('ត្រូវជ្រើសរើសសាខា').nullable(),
  departmentId: yup.number().typeError('ត្រូវជ្រើសរើសនាយកដ្ឋាន').nullable(),
  level: yup.string().nullable(),
});

function PositionFormModal({ show, initialData, companies, onClose, onSubmit, submitting }) {
  const isEdit = !!initialData;
  const [branchOptions, setBranchOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '', companyId: '', branchId: '', departmentId: '', level: '' },
  });

  const companyId = watch('companyId');
  const branchId = watch('branchId');

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? { name: initialData.name, description: initialData.description, companyId: initialData.companyId || '', branchId: initialData.branchId || '', departmentId: initialData.departmentId || '', level: initialData.level || '' }
          : { name: '', description: '', companyId: '', branchId: '', departmentId: '', level: '' }
      );
    }
  }, [show, initialData, reset]);

  useEffect(() => {
    if (!companyId) { setBranchOptions([]); return; }
    setLoadingBranches(true);
    branchApi.getByCompanyId(companyId).then((res) => setBranchOptions(res.data || [])).finally(() => setLoadingBranches(false));
  }, [companyId]);

  useEffect(() => {
    if (!branchId) { setDeptOptions([]); return; }
    setLoadingDepts(true);
    departmentApi.getByBranchId(branchId).then((res) => setDeptOptions(res.data || [])).finally(() => setLoadingDepts(false));
  }, [branchId]);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isEdit ? 'Edit Position' : 'New Position'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Name *</Form.Label>
                <Form.Control {...register('name')} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Level</Form.Label>
                <Form.Select {...register('level')}>
                  <option value="">-- Not Set --</option>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Description</Form.Label>
                <Form.Control as="textarea" rows={2} {...register('description')} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Company</Form.Label>
                <Form.Select {...register('companyId')} onChange={(e) => { setValue('companyId', e.target.value); setValue('branchId', ''); setValue('departmentId', ''); }}>
                  <option value="">-- Not Assigned --</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">
                  Branch {loadingBranches && <Spinner size="sm" animation="border" />}
                </Form.Label>
                <Form.Select {...register('branchId')} disabled={!companyId || loadingBranches} onChange={(e) => { setValue('branchId', e.target.value); setValue('departmentId', ''); }}>
                  <option value="">-- Not Assigned --</option>
                  {branchOptions.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">
                  Department {loadingDepts && <Spinner size="sm" animation="border" />}
                </Form.Label>
                <Form.Select {...register('departmentId')} disabled={!branchId || loadingDepts}>
                  <option value="">-- Not Assigned --</option>
                  {deptOptions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Position' : 'Create Position'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default PositionFormModal;