import { useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  code: yup
    .string()
    .required('ត្រូវការលេខកូដសាខា')
    .max(50),

  name: yup
    .string()
    .required('ត្រូវការឈ្មោះសាខា')
    .max(150),

  email: yup
    .string()
    .email('Email មិនត្រឹមត្រូវ')
    .nullable()
    .max(255),

  phone: yup
    .string()
    .nullable()
    .max(20),

  address: yup
    .string()
    .nullable()
    .max(255),

  companyId: yup
    .number()
    .typeError('ត្រូវជ្រើសរើសក្រុមហ៊ុន')
    .required('ត្រូវជ្រើសរើសក្រុមហ៊ុន'),

  headOffice: yup.boolean(),
});

const labelStyle = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: '7px',
};

const sectionTitleStyle = {
  fontSize: '14px',
  fontWeight: 700,
  color: 'var(--color-text)',
};

const sectionSubtitleStyle = {
  marginTop: '3px',
  fontSize: '12px',
  color: 'var(--color-text-muted)',
};

function inputStyle(hasError) {
  return {
    borderColor: hasError ? 'var(--color-danger)' : 'var(--color-border)',
    borderRadius: '7px',
    padding: '10px 12px',
    fontSize: '13px',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-surface)',
    boxShadow: 'none',
  };
}

function BranchFormModal({
  show,
  initialData,
  companies,
  onClose,
  onSubmit,
  submitting,
}) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),

    defaultValues: {
      code: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      companyId: '',
      headOffice: false,
    },
  });

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? {
              ...initialData,
              companyId: initialData.companyId,
            }
          : {
              code: '',
              name: '',
              email: '',
              phone: '',
              address: '',
              companyId: '',
              headOffice: false,
            }
      );
    }
  }, [show, initialData, reset]);

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      backdrop="static"
      contentClassName="border-0"
    >
      {/* =========================================================
          MODAL HEADER
      ========================================================== */}
      <Modal.Header
        closeButton
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: '20px 24px',
        }}
      >
        <div>
          <Modal.Title
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--color-text)',
              letterSpacing: '-0.01em',
            }}
          >
            {isEdit ? 'Edit Branch' : 'New Branch'}
          </Modal.Title>

          <div
            style={{
              marginTop: '4px',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
            }}
          >
            {isEdit
              ? 'Update branch information and organization details'
              : 'Create a new branch for your organization'}
          </div>
        </div>
      </Modal.Header>

      {/* =========================================================
          FORM
      ========================================================== */}
      <Form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* =======================================================
            MODAL BODY
        ======================================================== */}
        <Modal.Body
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '24px',
          }}
        >
          {/* =====================================================
              BASIC INFORMATION
          ====================================================== */}
          <div className="mb-4">
            <div style={sectionTitleStyle}>Branch Information</div>
            <div style={sectionSubtitleStyle}>
              Enter the primary information for this branch
            </div>
          </div>

          <Row className="g-4">

            {/* =================================================
                CODE
            ================================================== */}
            <Col md={4}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  Code <span style={{ color: 'var(--color-danger)' }}>*</span>
                </Form.Label>

                <Form.Control
                  {...register('code')}
                  placeholder="BR-001"
                  isInvalid={!!errors.code}
                  style={inputStyle(!!errors.code)}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.code?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* =================================================
                NAME
            ================================================== */}
            <Col md={8}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  Branch Name{' '}
                  <span style={{ color: 'var(--color-danger)' }}>*</span>
                </Form.Label>

                <Form.Control
                  {...register('name')}
                  placeholder="Phnom Penh Branch"
                  isInvalid={!!errors.name}
                  style={inputStyle(!!errors.name)}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* =================================================
                COMPANY
            ================================================== */}
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  Company{' '}
                  <span style={{ color: 'var(--color-danger)' }}>*</span>
                </Form.Label>

                <Form.Select
                  {...register('companyId')}
                  isInvalid={!!errors.companyId}
                  style={inputStyle(!!errors.companyId)}
                >
                  <option value="">-- Select Company --</option>

                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                  {errors.companyId?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* =================================================
                HEAD OFFICE
            ================================================== */}
            <Col md={6} className="d-flex align-items-end">
              <div
                style={{
                  width: '100%',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '7px',
                  backgroundColor: 'var(--color-bg)',
                }}
              >
                <Form.Check
                  type="switch"
                  id="headOffice"
                  label={
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                      }}
                    >
                      Head Office
                    </span>
                  }
                  {...register('headOffice')}
                  style={{ margin: 0 }}
                />
              </div>
            </Col>

            {/* =================================================
                CONTACT INFORMATION SECTION
            ================================================== */}
            <Col md={12}>
              <div
                style={{
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '20px',
                  marginTop: '2px',
                }}
              >
                <div style={sectionTitleStyle}>Contact Information</div>
                <div style={sectionSubtitleStyle}>
                  Contact details for this branch
                </div>
              </div>
            </Col>

            {/* =================================================
                EMAIL
            ================================================== */}
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>Email</Form.Label>

                <Form.Control
                  type="email"
                  {...register('email')}
                  placeholder="branch@company.com"
                  isInvalid={!!errors.email}
                  style={inputStyle(!!errors.email)}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* =================================================
                PHONE
            ================================================== */}
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>Phone</Form.Label>

                <Form.Control
                  {...register('phone')}
                  placeholder="+855 12 345 678"
                  style={inputStyle(false)}
                />
              </Form.Group>
            </Col>

            {/* =================================================
                ADDRESS
            ================================================== */}
            <Col md={12}>
              <Form.Group>
                <Form.Label style={labelStyle}>Address</Form.Label>

                <Form.Control
                  {...register('address')}
                  placeholder="Street, District, City, Country"
                  style={inputStyle(false)}
                />
              </Form.Group>
            </Col>

          </Row>
        </Modal.Body>

        {/* =======================================================
            MODAL FOOTER
        ======================================================== */}
        <Modal.Footer
          style={{
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            padding: '14px 24px',
          }}
        >
          {/* Cancel */}
          <Button
            variant="light"
            onClick={onClose}
            disabled={submitting}
            style={{
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: 600,
              padding: '9px 16px',
              boxShadow: 'none',
            }}
          >
            Cancel
          </Button>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            style={{
              border: '1px solid var(--color-primary)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: 600,
              padding: '9px 18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Saving...
              </>
            ) : isEdit ? (
              'Update Branch'
            ) : (
              'Create Branch'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BranchFormModal;