import { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { resolveUploadUrl } from '../../utils/url';

import { branchApi } from '../../api/branch.api';

const schema = yup.object({
  name: yup.string().required('ត្រូវការឈ្មោះ Department').max(100),
  description: yup.string().max(255).nullable(),
  companyId: yup.number().typeError('ត្រូវជ្រើសរើសក្រុមហ៊ុន').nullable(),
  branchId: yup.number().typeError('ត្រូវជ្រើសរើសសាខា').nullable(),
});

function DepartmentFormModal({ show, initialData, companies, onClose, onSubmit, submitting }) {
  const isEdit = !!initialData;
  const [branchOptions, setBranchOptions] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '', companyId: '', branchId: '' },
  });

  const selectedCompanyId = watch('companyId');

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? { name: initialData.name, description: initialData.description, companyId: initialData.companyId || '', branchId: initialData.branchId || '' }
          : { name: '', description: '', companyId: '', branchId: '' }
      );
      setLogoFile(null);
      setLogoPreview(initialData?.logoUrl ? resolveUploadUrl(initialData.logoUrl) : null);
    }
  }, [show, initialData, reset]);

  useEffect(() => {
    if (!selectedCompanyId) {
      setBranchOptions([]);
      return;
    }
    setLoadingBranches(true);
    branchApi
      .getByCompanyId(selectedCompanyId)
      .then((res) => setBranchOptions(res.data || []))
      .catch(() => setBranchOptions([]))
      .finally(() => setLoadingBranches(false));
  }, [selectedCompanyId]);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
          {isEdit ? 'Edit Department' : 'New Department'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit((data) => onSubmit(data, logoFile))} noValidate>
        <Modal.Body className="pt-2">
          <Row className="g-3">
            <Col md={12} className="d-flex align-items-center gap-3 mb-2">
              <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Department logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 22 }}>🗂️</span>
                )}
              </div>
              <Form.Group className="flex-grow-1">
                <Form.Label className="small fw-semibold">Department Logo</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setLogoFile(file);
                    setLogoPreview(URL.createObjectURL(file));
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Name *</Form.Label>
                <Form.Control {...register('name')} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Description</Form.Label>
                <Form.Control as="textarea" rows={2} {...register('description')} />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Company</Form.Label>
                <Form.Select
                  {...register('companyId')}
                  onChange={(e) => {
                    setValue('companyId', e.target.value);
                    setValue('branchId', '');
                  }}
                >
                  <option value="">-- Not Assigned --</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">
                  Branch {loadingBranches && <Spinner size="sm" animation="border" />}
                </Form.Label>
                <Form.Select {...register('branchId')} disabled={!selectedCompanyId || loadingBranches}>
                  <option value="">-- Not Assigned --</option>
                  {branchOptions.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="ent-btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Department' : 'Create Department'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default DepartmentFormModal;