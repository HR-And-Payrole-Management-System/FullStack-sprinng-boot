import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';

import AuthLayout from '../../layouts/AuthLayout';
import axiosClient from '../../api/axiosClient';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification link is missing a token.');
      return;
    }

    axiosClient
      .post('/auth/verify-email', { token })
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setErrorMessage(
          err.response?.data?.message || 'This verification link is invalid or has expired.'
        );
      });
  }, [token]);

  if (status === 'verifying') {
    return (
      <AuthLayout eyebrow="VERIFYING" title="Verifying your email">
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner size="sm" animation="border" />
          Please wait a moment...
        </div>
      </AuthLayout>
    );
  }

  if (status === 'success') {
    return (
      <AuthLayout eyebrow="VERIFIED" title="Email verified">
        <p className="text-muted mb-4">
          Your email has been verified. You can now sign in to your account.
        </p>
        <Link to="/login">
          <Button className="w-100">Go to Sign In</Button>
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow="VERIFICATION FAILED" title="This link isn't valid">
      <p className="text-muted mb-4">{errorMessage}</p>
      <Link to="/login">
        <Button variant="outline-secondary" className="w-100">Back to Sign In</Button>
      </Link>
    </AuthLayout>
  );
}

export default VerifyEmail;