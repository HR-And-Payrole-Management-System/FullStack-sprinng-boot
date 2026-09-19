import { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { branchApi } from '../../api/branch.api';

const TYPES = ['PUBLIC_HOLIDAY', 'COMPANY_HOLIDAY', 'BRANCH_HOLIDAY', 'OTHER'];

const schema = yup.object({
  name: yup.string().required('ត្រូវការឈ្មោះថ្ងៃឈប់សម្រាក').max(150),
  holidayDate: yup.string().required('ត្រូវការកាលបរិច្ឆេទ'),
  type: yup.string().required('ត្រូវជ្រើសរើសប្រភេទ'),
 
companyId: yup
  .number()
  .transform((value, originalValue) => (originalValue === '' ? null : value))
  .nullable(),
branchId: yup
  .number()
  .transform((value, originalValue) => (originalValue === '' ? null : value))
  .nullable(),
  description: yup.string().max(500).nullable(),
  paidHoliday: yup.boolean().required(),
});

function HolidayFormModal({ show, initialData, companies, onClose, onSubmit, submitting }) {
  const isEdit = !!initialData;
  const [branchOptions, setBranchOptions] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', holidayDate: '', type: 'PUBLIC_HOLIDAY', companyId: '', branchId: '', description: '', paidHoliday: true },
  });

  const companyId = watch('companyId');

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? { ...initialData, companyId: initialData.companyId || '', branchId: initialData.branchId || '' }
          : { name: '', holidayDate: '', type: 'PUBLIC_HOLIDAY', companyId: '', branchId: '', description: '', paidHoliday: true }
      );
    }
  }, [show, initialData, reset]);

  useEffect(() => {
    if (!companyId) { setBranchOptions([]); return; }
    setLoadingBranches(true);
    branchApi.getByCompanyId(companyId).then((res) => setBranchOptions(res.data || [])).finally(() => setLoadingBranches(false));
  }, [companyId]);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isEdit ? 'Edit Holiday' : 'New Holiday'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={7}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Name *</Form.Label>
                <Form.Control {...register('name')} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={5}>
            <Form.Group>
              <Form.Label className="small fw-semibold">Start Date *</Form.Label>
              <Form.Control type="date" {...register('holidayDate')} isInvalid={!!errors.holidayDate} />
              <Form.Control.Feedback type="invalid">{errors.holidayDate?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group>
              <Form.Label className="small fw-semibold">End Date *</Form.Label>
              <Form.Control type="date" {...register('endDate')} isInvalid={!!errors.endDate} />
              <Form.Control.Feedback type="invalid">{errors.endDate?.message}</Form.Control.Feedback>
            </Form.Group>
          </Col>
            
            <Col md={5}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Type *</Form.Label>
                <Form.Select {...register('type')}>
                  {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Company</Form.Label>
                <Form.Select {...register('companyId')}>
                  <option value="">-- All --</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-semibold">
                  Branch {loadingBranches && <Spinner size="sm" animation="border" />}
                </Form.Label>
                <Form.Select {...register('branchId')} disabled={!companyId}>
                  <option value="">-- All --</option>
                  {branchOptions.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Description</Form.Label>
                <Form.Control as="textarea" rows={2} {...register('description')} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Check type="switch" id="paidHoliday" label="Paid Holiday" {...register('paidHoliday')} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Holiday' : 'Create Holiday'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default HolidayFormModal;