import { useEffect, useState, useMemo } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { resolveUploadUrl } from '../../utils/url';

const ALLOWED_LOGO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_LOGO_SIZE = 3 * 1024 * 1024; // 3MB

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
  const { t } = useTranslation();
  const isEdit = !!initialData;

  const schema = useMemo(() => yup.object({
    code: yup
      .string()
      .required(t('branch.validation.codeRequired'))
      .max(50),

    name: yup
      .string()
      .required(t('branch.validation.nameRequired'))
      .max(150),

    email: yup
      .string()
      .email(t('branch.validation.emailInvalid'))
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
      .typeError(t('branch.validation.companyRequired'))
      .required(t('branch.validation.companyRequired')),

    headOffice: yup.boolean(),
  }), [t]);

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

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoError, setLogoError] = useState('');

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

      setLogoFile(null);
      setLogoError('');
      setLogoPreview(
        initialData?.logoUrl ? resolveUploadUrl(initialData.logoUrl) : null
      );
    }
  }, [show, initialData, reset]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setLogoError(t('branch.logoOnlyTypes'));
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setLogoError(t('branch.logoMaxSize'));
      return;
    }

    setLogoError('');
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

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
            {isEdit ? t('branch.editBranch') : t('branch.newBranch')}
          </Modal.Title>

          <div
            style={{
              marginTop: '4px',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
            }}
          >
            {isEdit
              ? t('branch.subtitleEdit')
              : t('branch.subtitleCreate')}
          </div>
        </div>
      </Modal.Header>

      {/* =========================================================
          FORM
      ========================================================== */}
      <Form
        onSubmit={handleSubmit((data) => onSubmit(data, logoFile))}
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
            <div style={sectionTitleStyle}>{t('branch.branchInformation')}</div>
            <div style={sectionSubtitleStyle}>
              {t('branch.branchInfoSubtitle')}
            </div>
          </div>

          {/* =====================================================
              BRANCH IMAGE (NEW)
          ====================================================== */}
          <div
            className="mb-4 d-flex align-items-center gap-3"
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              padding: '14px',
              backgroundColor: 'var(--color-bg)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                flexShrink: 0,
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {logoPreview ? (
              <img
                src={logoPreview}
                alt="Branch preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'; // hide the broken-image icon
                  setLogoPreview(null); // falls back to the placeholder SVG below on next render
                }}
              />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-subtle)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            )}
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                {t('branch.branchImage')}
              </div>

              <label
                className="mt-2 d-inline-flex align-items-center gap-2"
                style={{
                  cursor: 'pointer',
                  border: '1px solid var(--color-border)',
                  borderRadius: '7px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoChange}
                  hidden
                />
                {logoPreview ? t('branch.changeImage') : t('branch.uploadImage')}
              </label>

              <div style={{ marginTop: '5px', fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                {t('branch.logoHint')}
              </div>

              {logoError && (
                <div style={{ marginTop: '3px', fontSize: '11.5px', fontWeight: 600, color: 'var(--color-danger)' }}>
                  {logoError}
                </div>
              )}
            </div>
          </div>

          <Row className="g-4">

            {/* =================================================
                CODE
            ================================================== */}
            <Col md={4}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  {t('branch.fieldCode')} <span style={{ color: 'var(--color-danger)' }}>*</span>
                </Form.Label>

                <Form.Control
                  {...register('code')}
                  placeholder={t('branch.placeholderCode')}
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
                  {t('branch.fieldBranchName')}{' '}
                  <span style={{ color: 'var(--color-danger)' }}>*</span>
                </Form.Label>

                <Form.Control
                  {...register('name')}
                  placeholder={t('branch.placeholderName')}
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
                  {t('nav.company')}{' '}
                  <span style={{ color: 'var(--color-danger)' }}>*</span>
                </Form.Label>

                <Form.Select
                  {...register('companyId')}
                  isInvalid={!!errors.companyId}
                  style={inputStyle(!!errors.companyId)}
                >
                  <option value="">{t('branch.selectCompany')}</option>

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
                      {t('branch.headOffice')}
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
                <div style={sectionTitleStyle}>{t('branch.contactInformation')}</div>
                <div style={sectionSubtitleStyle}>
                  {t('branch.contactInfoSubtitle')}
                </div>
              </div>
            </Col>

            {/* =================================================
                EMAIL
            ================================================== */}
            <Col md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>{t('company.fieldEmail')}</Form.Label>

                <Form.Control
                  type="email"
                  {...register('email')}
                  placeholder={t('branch.placeholderEmail')}
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
                <Form.Label style={labelStyle}>{t('company.fieldPhone')}</Form.Label>

                <Form.Control
                  {...register('phone')}
                  placeholder={t('branch.placeholderPhone')}
                  style={inputStyle(false)}
                />
              </Form.Group>
            </Col>

            {/* =================================================
                ADDRESS
            ================================================== */}
            <Col md={12}>
              <Form.Group>
                <Form.Label style={labelStyle}>{t('company.fieldAddress')}</Form.Label>

                <Form.Control
                  {...register('address')}
                  placeholder={t('branch.placeholderAddress')}
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
            {t('common.cancel')}
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
                {t('branch.saving')}
              </>
            ) : isEdit ? (
              t('branch.updateBranch')
            ) : (
              t('branch.createBranch')
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BranchFormModal;