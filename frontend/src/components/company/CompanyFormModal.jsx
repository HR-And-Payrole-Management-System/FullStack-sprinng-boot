
import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { resolveUploadUrl } from '../../utils/url';

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

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';

const inputErrorCls =
  'w-full rounded-lg border border-red-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';

const ALLOWED_LOGO_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const MAX_LOGO_SIZE = 3 * 1024 * 1024;

function CompanyFormModal({
  show,
  mode = 'create',
  onHide,
  onSubmit,
  initialData,
  submitting,
  serverError,
}) {
  const { t } = useTranslation();
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const schema = useMemo(() => yup.object({
    name: yup
      .string()
      .max(150, t('company.validation.nameMax'))
      .required(t('company.validation.nameRequired')),

    email: yup
      .string()
      .email(t('company.validation.emailInvalid'))
      .max(255)
      .required(t('company.validation.emailRequired')),

    phone: yup
      .string()
      .max(20, t('company.validation.phoneMax'))
      .nullable(),

    address: yup
      .string()
      .max(255, t('company.validation.addressMax'))
      .nullable(),

    taxNumber: yup
      .string()
      .max(100, t('company.validation.taxMax'))
      .nullable(),

    registrationNumber: yup
      .string()
      .max(100, t('company.validation.regMax'))
      .nullable(),

    website: yup
      .string()
      .max(255, t('company.validation.websiteMax'))
      .nullable(),
  }), [t]);

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
        t('company.logoOnlyTypes')
      );
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setLogoError(t('company.logoMaxSize'));
      return;
    }

    setLogoError('');
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  if (!show) return null;

  const titleMap = {
    create: t('company.formTitleCreate'),
    edit: t('company.formTitleEdit'),
    view: t('company.formTitleView'),
  };

  const subtitleMap = {
    create: t('company.formSubtitleCreate'),
    edit: t('company.formSubtitleEdit'),
    view: t('company.formSubtitleView'),
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

          <div
            className="
              max-h-[65vh]
              overflow-y-auto
              bg-white
              px-6 py-6
            "
          >

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

                {!isView && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      {t('company.companyLogo')}
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
                          ? t('company.changeLogo')
                          : t('company.uploadLogo')}
                      </label>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-400">
                      {t('company.logoHint')}
                    </p>

                    {logoError && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {logoError}
                      </p>
                    )}
                  </div>
                )}

                {isView && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700">
                      {t('company.companyLogo')}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {t('company.orgBranding')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {t('company.companyInformation')}
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                {t('company.companyInfoSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <Field
                label={t('company.fieldCompanyName')}
                error={errors.name?.message}
              >
                <input
                  disabled={isView}
                  className={
                    errors.name
                      ? inputErrorCls
                      : inputCls
                  }
                  placeholder={t('company.placeholderName')}
                  {...register('name')}
                />
              </Field>

              <Field
                label={t('company.fieldEmail')}
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
                  placeholder={t('company.placeholderEmail')}
                  {...register('email')}
                />
              </Field>

              <Field
                label={t('company.fieldPhone')}
                error={errors.phone?.message}
              >
                <input
                  disabled={isView}
                  className={
                    errors.phone
                      ? inputErrorCls
                      : inputCls
                  }
                  placeholder={t('company.placeholderPhone')}
                  {...register('phone')}
                />
              </Field>

              <Field
                label={t('company.fieldWebsite')}
                error={errors.website?.message}
              >
                <input
                  disabled={isView}
                  className={
                    errors.website
                      ? inputErrorCls
                      : inputCls
                  }
                  placeholder={t('company.placeholderWebsite')}
                  {...register('website')}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field
                  label={t('company.fieldAddress')}
                  error={errors.address?.message}
                >
                  <input
                    disabled={isView}
                    className={
                      errors.address
                        ? inputErrorCls
                        : inputCls
                    }
                    placeholder={t('company.placeholderAddress')}
                    {...register('address')}
                  />
                </Field>
              </div>

              <div className="sm:col-span-2 pt-2">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    {t('company.registrationInformation')}
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {t('company.registrationInfoSubtitle')}
                  </p>
                </div>
              </div>

              <Field
                label={t('company.fieldTaxNumber')}
                error={errors.taxNumber?.message}
              >
                <input
                  disabled={isView}
                  className={
                    errors.taxNumber
                      ? inputErrorCls
                      : inputCls
                  }
                  placeholder={t('company.placeholderTax')}
                  {...register('taxNumber')}
                />
              </Field>

              <Field
                label={t('company.fieldRegistrationNumber')}
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
                  placeholder={t('company.placeholderReg')}
                  {...register('registrationNumber')}
                />
              </Field>
            </div>
          </div>

          <div
            className="
              flex justify-end
              gap-2
              border-t border-slate-200
              bg-slate-50
              px-6 py-4
            "
          >
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
                {t('common.close')}
              </button>
            ) : (
              <>
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
                  {t('common.cancel')}
                </button>

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
                    ? t('company.saveChanges')
                    : t('company.createCompany')}
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