import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AuthLayout from '../../layouts/AuthLayout';
import { authService } from '../../services/auth.service';
import { LockIcon } from '../../components/common/AuthIcons';

const schema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Confirm your new password'),
});

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    if (!token) {
      setServerError('This reset link is missing or invalid.');
      return;
    }

    setServerError('');
    setSubmitting(true);

    try {
      await authService.resetPassword(token, data.newPassword, data.confirmPassword);
      setSuccess(true);
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'This reset link is invalid or has expired.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout eyebrow="LINK INVALID" title="This link isn't valid">
        <p className="text-muted mb-4">
          The reset link is missing its token. Please request a new one.
        </p>
        <Link to="/forgot-password">
          <Button className="w-100">Request New Link</Button>
        </Link>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout eyebrow="PASSWORD UPDATED" title="Your password has been reset">
        <p className="text-muted mb-4">
          You can now sign in with your new password. For your security, you've
          been signed out of all other devices.
        </p>
        <Button className="w-100" onClick={() => navigate('/login')}>
          Go to Sign In
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="RESET PASSWORD"
      title="Set a new password"
      subtitle="Choose a strong password for your account"
    >
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Form.Group className="mb-3">
          <Form.Label>New password</Form.Label>
          <div className="auth-input-icon-group">
            <LockIcon />
            <Form.Control
              type="password"
              placeholder="At least 8 characters"
              {...form.register('newPassword')}
              isInvalid={!!form.formState.errors.newPassword}
            />
          </div>
          <Form.Control.Feedback
            type="invalid"
            style={{ display: form.formState.errors.newPassword ? 'block' : 'none' }}
          >
            {form.formState.errors.newPassword?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Confirm new password</Form.Label>
          <div className="auth-input-icon-group">
            <LockIcon />
            <Form.Control
              type="password"
              placeholder="Re-enter your new password"
              {...form.register('confirmPassword')}
              isInvalid={!!form.formState.errors.confirmPassword}
            />
          </div>
          <Form.Control.Feedback
            type="invalid"
            style={{ display: form.formState.errors.confirmPassword ? 'block' : 'none' }}
          >
            {form.formState.errors.confirmPassword?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" className="w-100" disabled={submitting}>
          {submitting ? <Spinner size="sm" animation="border" /> : 'Reset Password'}
        </Button>
      </Form>
    </AuthLayout>
  );
}

export default ResetPassword;