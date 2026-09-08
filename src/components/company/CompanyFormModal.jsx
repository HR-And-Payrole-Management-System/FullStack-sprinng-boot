
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { resolveUploadUrl } from '../../utils/url';

const schema = yup.object({
  name: yup
    .string()
    .max(150, 'Max 150 characters')
    .required('Company name is required'),

  email: yup
    .string()
    .email('Enter a valid email')
    .max(255)
    .required('Company email is required'),

  phone: yup
    .string()
    .max(20, 'Max 20 characters')
    .nullable(),

  address: yup
    .string()
    .max(255, 'Max 255 characters')
    .nullable(),

  taxNumber: yup
    .string()
    .max(100, 'Max 100 characters')
    .nullable(),

  registrationNumber: yup
    .string()
    .max(100, 'Max 100 characters')
    .nullable(),

  website: yup
    .string()
    .max(255, 'Max 255 characters')
    .nullable(),
});

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/*
 * Enterprise UI color system
 *
 * Primary: Navy / Slate
 * Background: Slate-50
 * Surface: White
 * Border: Slate-200
 * Text: Slate-900
 * Muted: Slate-500
 */
const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';

const inputErrorCls =
  'w-full rounded-lg border border-red-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';

const ALLOWED_LOGO_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const MAX_LOGO_SIZE = 3 * 1024 * 1024; // 3MB

function CompanyFormModal({
  show,
  mode = 'create',
  onHide,
  onSubmit,
  initialData,
  submitting,
  serverError,
}) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoError, setLogoError] = useState('');

  useEffect(() => {
    if (show) {
      reset(
        initialData ?? {
          name: '',
          email: '',
          phone: '',
          address: '',
          taxNumber: '',
          registrationNumber: '',
          website: '',
        }
      );

      setLogoFile(null);
      setLogoError('');

      setLogoPreview(
        initialData?.logoUrl
          ? resolveUploadUrl(initialData.logoUrl)
          : null
      );
    }
  }, [show, initialData, reset]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setLogoError(
        'Only JPG, PNG, or WEBP images are allowed.'
      );
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setLogoError('Logo must be 3MB or smaller.');
      return;
    }

    setLogoError('');
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  if (!show) return null;

  const titleMap = {
    create: 'Add Company',
    edit: 'Edit Company',
    view: 'Company Details',
  };

  const subtitleMap = {
    create: 'Register a new organization',
    edit: 'Update this organization’s details',
    view: 'Read-only view',
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-950/50
        p-4
        backdrop-blur-[2px]
      "
      onClick={!submitting ? onHide : undefined}
    >
      {/* Modal */}
      <div
        className="
          w-full max-w-2xl
          overflow-hidden
          rounded-xl
          border border-slate-200
          bg-white
          shadow-2xl
          shadow-slate-900/20
        "
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={
            isView
              ? (e) => e.preventDefault()
              : handleSubmit((data) =>
                  onSubmit(data, logoFile)
                )
          }
          noValidate
        >

          {/* =====================================================
              HEADER
          ====================================================== */}
          <div
            className="
              flex items-start justify-between
              border-b border-slate-200
              bg-white
              px-6 py-5
            "
          >
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                {titleMap[mode]}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {subtitleMap[mode]}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onHide}
              disabled={submitting}
              aria-label="Close"
              className="
                rounded-lg
                p-2
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* =====================================================
              FORM BODY
          ====================================================== */}
          <div
            className="
              max-h-[65vh]
              overflow-y-auto
              bg-white
              px-6 py-6
            "
          >

            {/* Server Error */}
            {serverError && (
              <div
                className="
                  mb-5
                  rounded-lg
                  border border-red-200
                  bg-red-50
                  px-4 py-3
                  text-sm
                  font-medium
                  text-red-700
                "
              >
                {serverError}
              </div>
            )}

            {/* =================================================
                COMPANY LOGO
            ================================================== */}
            <div
              className="
                mb-6
                rounded-lg
                border border-slate-200
                bg-slate-50
                p-4
              "
            >
              <div className="flex items-center gap-4">

                {/* Logo Preview */}
                <div
                  className="
                    flex h-16 w-16
                    shrink-0
                    items-center justify-center
                    overflow-hidden
                    rounded-lg
                    border border-slate-200
                    bg-white
                  "
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-slate-300"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                      />
                      <circle
                        cx="8.5"
                        cy="8.5"
                        r="1.5"
                      />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  )}
                </div>

                {/* Upload */}
                {!isView && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Company Logo
                    </div>

                    <div className="mt-2">
                      <label
                        className="
                          inline-flex
                          cursor-pointer
                          items-center
                          gap-2
                          rounded-lg
                          border border-slate-300
                          bg-white
                          px-3 py-2
                          text-sm
                          font-semibold
                          text-slate-700
                          transition
                          hover:border-slate-400
                          hover:bg-slate-100
                        "
                      >
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleLogoChange}
                          className="hidden"
                        />

                        {logoPreview
                          ? 'Change Logo'
                          : 'Upload Logo'}
                      </label>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-400">
                      JPG, PNG, or WEBP. Maximum 3MB.
                    </p>

                    {logoError && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {logoError}
                      </p>
                    )}
                  </div>
                )}

                {/* View Mode */}
                {isView && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      Company Logo
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Organization branding
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                COMPANY INFORMATION
            ================================================== */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Company Information
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Basic information about the organization
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Company Name */}
              <Field
                label="Company Name"
                error={errors.name?.message}
              >
                <input
                  disabled={isView}
                  className={
                    errors.name
                      ? inputErrorCls
                      : inputCls
                  }
                  placeholder="Acme Corporation"
                  {...register('name')}
                />
              </Field>

              {/* Email */}
              <Field
                label="Email"
                error={errors.email?.message}
              >
                <input
                  disabled={isView}
                  type="email"
                  className={
                    errors.email
                      ? inputErrorCls
                      : inputCls
                  }
                  placeholder="contact@acme.com"
                  {...register('email')}
                />
              </Field>

              {/* Phone */}
              <Field
                label="Phone"
                error={errors.phone?.message}
              >
                <input
                  disabled={isView}
                  className={
                    errors.phone
                      ? inputErrorCls
                      : inputCls
                  }
                  placeholder="+1 555 019 8372"
                  {...register('phone')}
                />
              </Field>

              {/* Website */}
              <Field
                label="Website"
                error={errors.website?.message}
              >
                <input
                  disabled={isView}
                  className={
                    errors.website
                      ? inputErrorCls
                      : inputCls
                  }
                  placeholder="https://acme.com"
                  {...register('website')}
                />
              </Field>

              {/* Address */}
              <div className="sm:col-span-2">
                <Field
                  label="Address"
                  error={errors.address?.message}
                >
                  <input
                    disabled={isView}
                    className={
                      errors.address
                        ? inputErrorCls
                        : inputCls
                    }
                    placeholder="Street, City, Country"
                    {...register('address')}
                  />
                </Field>
              </div>

              {/* =================================================
                  REGISTRATION INFORMATION
              ================================================== */}
              <div className="sm:col-span-2 pt-2">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Registration Information
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Legal and tax identification details
                  </p>
                </div>
              </div>

              {/* Tax Number */}
              <Field
                label="Tax Number"
                error={errors.taxNumber?.message}
              >
                <input
                  disabled={isView}
                  className={
                    errors.taxNumber
                      ? inputErrorCls
                      : inputCls
                  }
                  placeholder="TAX-000000"
                  {...register('taxNumber')}
                />
              </Field>

              {/* Registration Number */}
              <Field
                label="Registration Number"
                error={
                  errors.registrationNumber?.message
                }
              >
                <input
                  disabled={isView}
                  className={
                    errors.registrationNumber
                      ? inputErrorCls
                      : inputCls
                  }
                  placeholder="REG-000000"
                  {...register('registrationNumber')}
                />
              </Field>
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ====================================================== */}
          <div
            className="
              flex justify-end
              gap-2
              border-t border-slate-200
              bg-slate-50
              px-6 py-4
            "
          >
            {/* VIEW MODE */}
            {isView ? (
              <button
                type="button"
                onClick={onHide}
                className="
                  rounded-lg
                  border border-slate-300
                  bg-white
                  px-4 py-2
                  text-sm
                  font-semibold
                  text-slate-700
                  shadow-sm
                  transition
                  hover:bg-slate-100
                  hover:text-slate-900
                "
              >
                Close
              </button>
            ) : (
              <>
                {/* Cancel */}
                <button
                  type="button"
                  onClick={onHide}
                  disabled={submitting}
                  className="
                    rounded-lg
                    border border-slate-300
                    bg-white
                    px-4 py-2
                    text-sm
                    font-semibold
                    text-slate-700
                    shadow-sm
                    transition
                    hover:bg-slate-100
                    hover:text-slate-900
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    border border-slate-800
                    bg-slate-800
                    px-4 py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:border-slate-900
                    hover:bg-slate-900
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {submitting && (
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  )}

                  {isEdit
                    ? 'Save Changes'
                    : 'Create Company'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyFormModal;

