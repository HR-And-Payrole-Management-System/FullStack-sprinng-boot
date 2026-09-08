import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AuthLayout from '../../layouts/AuthLayout';
import { authService } from '../../services/auth.service';
import { MailIcon } from '../../components/common/AuthIcons';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

function ForgotPassword() {
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState(null);

  const form = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);

    try {
      await authService.forgotPassword(data.email);
      // Backend always responds success (even if the email doesn't
      // exist) to avoid leaking which emails are registered — the UI
      // mirrors that and never says "email not found".
      setSentTo(data.email);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sentTo) {
    return (
      <AuthLayout eyebrow="CHECK YOUR EMAIL" title="Reset link sent">
        <div className="auth-success-icon">
          <MailIcon />
        </div>

        <p
          className="text-muted mb-4"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', lineHeight: 1.7 }}
        >
          If an account exists for <strong>{sentTo}</strong>, we've sent a link to
          reset your password. The link expires in 30 minutes.
        </p>

        <Link to="/login">
          <Button className="w-100">Back to Sign In</Button>
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="RESET PASSWORD"
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Form.Group className="mb-4">
          <Form.Label>Email</Form.Label>
          <div className="auth-input-icon-group">
            <MailIcon />
            <Form.Control
              type="email"
              placeholder="you@company.com"
              {...form.register('email')}
              isInvalid={!!form.formState.errors.email}
            />
          </div>
          <Form.Control.Feedback
            type="invalid"
            style={{ display: form.formState.errors.email ? 'block' : 'none' }}
          >
            {form.formState.errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" className="w-100" disabled={submitting}>
          {submitting ? <Spinner size="sm" animation="border" /> : 'Send Reset Link'}
        </Button>

        <div className="auth-form-footer">
          Remembered your password? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </Form>
    </AuthLayout>
  );
}

export default ForgotPassword;