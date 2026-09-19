import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { MailIcon, LockIcon, ShieldCheckIcon, LockClosedIcon } from '../../components/common/AuthIcons';

const credentialsSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const otpSchema = yup.object({
  otpCode: yup
    .string()
    .matches(/^\d{6}$/, 'Code must be 6 digits')
    .required('Enter the verification code'),
});

const GOOGLE_AUTH_URL = 'http://localhost:8081/oauth2/authorization/google';
const GITHUB_AUTH_URL = 'http://localhost:8081/oauth2/authorization/github';

function Login() {
  const { login, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('credentials');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [challenge, setChallenge] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const credentialsForm = useForm({ resolver: yupResolver(credentialsSchema) });
  const otpForm = useForm({ resolver: yupResolver(otpSchema) });

  useEffect(() => {
    if (step !== 'otp' || secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [step, secondsLeft]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // ១ērr — បើ backend redirect មកវិញជាមួយ ?error=oauth_failed
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'oauth_failed') {
      setServerError('Google/GitHub sign-in failed. Please try again.');
    }
  }, [location.search]);

  const onSubmitCredentials = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      const result = await login(data.email, data.password);
      setChallenge(result);
      setSecondsLeft(result.otpExpiresInSeconds ?? 300);
      setCooldown(60);
      setStep('otp');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitOtp = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      await verifyOtp(challenge.preAuthToken, data.otpCode);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    setServerError('');
    setResending(true);
    try {
      await resendOtp(challenge.preAuthToken);
      setSecondsLeft(challenge.otpExpiresInSeconds ?? 300);
      setCooldown(60);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not resend the code');
    } finally {
      setResending(false);
    }
  };

  const backToCredentials = () => {
    setStep('credentials');
    setChallenge(null);
    setServerError('');
    otpForm.reset();
    credentialsForm.reset({ email: '', password: '' }); // clears stale values so autofill can't silently re-submit
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  const handleGithubLogin = () => {
    window.location.href = GITHUB_AUTH_URL;
  };

  if (step === 'otp' && challenge) {
    return (
      <AuthLayout
        eyebrow="STEP 2 OF 2"
        title="Enter verification code"
        subtitle={`We sent a 6-digit code to ${challenge.maskedEmail}`}
      >
        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form onSubmit={otpForm.handleSubmit(onSubmitOtp)} noValidate>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              autoComplete="one-time-code"
              className="auth-otp-input"
              {...otpForm.register('otpCode')}
              isInvalid={!!otpForm.formState.errors.otpCode}
            />
            <Form.Control.Feedback type="invalid">
              {otpForm.formState.errors.otpCode?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">
              {secondsLeft > 0
                ? `Code expires in ${formatTime(secondsLeft)}`
                : 'Code expired — request a new one'}
            </small>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="p-0"
              disabled={cooldown > 0 || resending}
              onClick={onResend}
            >
              {resending ? 'Sending...' : cooldown > 0 ? `Resend code (${cooldown}s)` : 'Resend code'}
            </Button>
          </div>

          <Button type="submit" className="w-100 mb-2" disabled={submitting}>
            {submitting ? <Spinner size="sm" animation="border" /> : 'Verify'}
          </Button>

          <Button
            type="button"
            variant="outline-secondary"
            className="w-100"
            onClick={backToCredentials}
            disabled={submitting}
          >
            Back
          </Button>
        </Form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow="SIGN IN" title="Welcome back" subtitle="Enter your credentials to access your workspace">
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Form onSubmit={credentialsForm.handleSubmit(onSubmitCredentials)} noValidate autoComplete="off">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <div className="auth-input-icon-group">
            <MailIcon />
            <Form.Control
              type="email"
              placeholder="you@company.com"
              autoComplete="off"
              {...credentialsForm.register('email')}
              isInvalid={!!credentialsForm.formState.errors.email}
            />
          </div>
          <Form.Control.Feedback type="invalid" style={{ display: credentialsForm.formState.errors.email ? 'block' : 'none' }}>
            {credentialsForm.formState.errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Password</Form.Label>
          <div className="auth-input-icon-group">
            <LockIcon />
            <Form.Control
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...credentialsForm.register('password')}
              isInvalid={!!credentialsForm.formState.errors.password}
            />
          </div>
          <Form.Control.Feedback type="invalid" style={{ display: credentialsForm.formState.errors.password ? 'block' : 'none' }}>
            {credentialsForm.formState.errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="auth-form-row">
          <Form.Check type="checkbox" id="remember-me" label="Remember this device" />
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-100" disabled={submitting}>
          {submitting ? <Spinner size="sm" animation="border" /> : 'Sign In'}
        </Button>

        <div className="auth-trust-row">
          <span><ShieldCheckIcon /> Encrypted in transit</span>
          <span><LockClosedIcon /> Audit logged</span>
        </div>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="mx-2 text-muted small">OR</span>
          <hr className="flex-grow-1" />
        </div>

        <div className="d-grid gap-2">
          <Button
            type="button"
            variant="outline-secondary"
            className="d-flex align-items-center justify-content-center gap-2"
            onClick={handleGoogleLogin}
            disabled={submitting}
          >
            <img src="https://www.google.com/favicon.ico" alt="" width={16} height={16} />
            Continue with Google
          </Button>

          <Button
            type="button"
            variant="outline-dark"
            className="d-flex align-items-center justify-content-center gap-2"
            onClick={handleGithubLogin}
            disabled={submitting}
          >
            <img src="https://github.com/favicon.ico" alt="" width={16} height={16} />
            Continue with GitHub
          </Button>
        </div>

        <div className="auth-form-footer">
          Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
        </div>
      </Form>
    </AuthLayout>
  );
}

export default Login;