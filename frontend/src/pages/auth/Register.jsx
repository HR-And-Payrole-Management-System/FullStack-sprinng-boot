import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AuthLayout from '../../layouts/AuthLayout';
import { authService } from '../../services/auth.service';
import { MailIcon, LockIcon, UserIcon, PhoneIcon } from '../../components/common/AuthIcons';

const registerSchema = yup.object({
  firstName: yup.string().max(100).required('First name is required'),
  lastName: yup.string().max(100).required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().max(20).nullable(),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
});

function Register() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [emailSendFailed, setEmailSendFailed] = useState(false);

  const form = useForm({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);

    try {
      const user = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      });

      // Backend creates the account but requires email verification
      // before login is possible — show a confirmation step, don't
      // pretend the user is signed in. If the verification email itself
      // failed to send (after backend retries), tell the user honestly
      // instead of always claiming "Check your inbox".
      setEmailSendFailed(user?.emailSent === false);
      setRegisteredEmail(data.email);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (registeredEmail) {
    return (
      <AuthLayout
        eyebrow="ACCOUNT CREATED"
        title={emailSendFailed ? 'Almost there' : 'Check your inbox'}
      >
        <div className="auth-success-icon">
          <MailIcon />
        </div>

        {emailSendFailed ? (
          <>
            <Alert variant="warning">
              Your account was created, but we couldn't send the verification email
              to <strong>{registeredEmail}</strong> right now.
            </Alert>
            <p className="text-muted mb-3" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', lineHeight: 1.7 }}>
              Please use "Resend verification" from the sign-in page once you're ready.
            </p>
          </>
        ) : (
          <p className="text-muted mb-4" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', lineHeight: 1.7 }}>
            We sent a verification link to <strong>{registeredEmail}</strong>.
            Verify your email before signing in — the link expires in 24 hours.
          </p>
        )}

        <Button className="w-100" onClick={() => navigate('/login')}>
          Back to Sign In
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow="CREATE ACCOUNT" title="Set up your account" subtitle="Join your organization's HR workspace">
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="auth-form-name-row mb-3">
          <Form.Group>
            <Form.Label>First name</Form.Label>
            <div className="auth-input-icon-group">
              <UserIcon />
              <Form.Control
                type="text"
                placeholder="Sokha"
                {...form.register('firstName')}
                isInvalid={!!form.formState.errors.firstName}
              />
            </div>
            <Form.Control.Feedback type="invalid" style={{ display: form.formState.errors.firstName ? 'block' : 'none' }}>
              {form.formState.errors.firstName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Last name</Form.Label>
            <div className="auth-input-icon-group">
              <UserIcon />
              <Form.Control
                type="text"
                placeholder="Chan"
                {...form.register('lastName')}
                isInvalid={!!form.formState.errors.lastName}
              />
            </div>
            <Form.Control.Feedback type="invalid" style={{ display: form.formState.errors.lastName ? 'block' : 'none' }}>
              {form.formState.errors.lastName?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Work email</Form.Label>
          <div className="auth-input-icon-group">
            <MailIcon />
            <Form.Control
              type="email"
              placeholder="you@company.com"
              {...form.register('email')}
              isInvalid={!!form.formState.errors.email}
            />
          </div>
          <Form.Control.Feedback type="invalid" style={{ display: form.formState.errors.email ? 'block' : 'none' }}>
            {form.formState.errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone <span className="text-muted">(optional)</span></Form.Label>
          <div className="auth-input-icon-group">
            <PhoneIcon />
            <Form.Control
              type="tel"
              placeholder="012 345 678"
              {...form.register('phone')}
              isInvalid={!!form.formState.errors.phone}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <div className="auth-input-icon-group">
            <LockIcon />
            <Form.Control
              type="password"
              placeholder="At least 8 characters"
              {...form.register('password')}
              isInvalid={!!form.formState.errors.password}
            />
          </div>
          <Form.Control.Feedback type="invalid" style={{ display: form.formState.errors.password ? 'block' : 'none' }}>
            {form.formState.errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Confirm password</Form.Label>
          <div className="auth-input-icon-group">
            <LockIcon />
            <Form.Control
              type="password"
              placeholder="Re-enter your password"
              {...form.register('confirmPassword')}
              isInvalid={!!form.formState.errors.confirmPassword}
            />
          </div>
          <Form.Control.Feedback type="invalid" style={{ display: form.formState.errors.confirmPassword ? 'block' : 'none' }}>
            {form.formState.errors.confirmPassword?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" className="w-100" disabled={submitting}>
          {submitting ? <Spinner size="sm" animation="border" /> : 'Create Account'}
        </Button>

        <div className="auth-form-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </Form>
    </AuthLayout>
  );
}

export default Register;