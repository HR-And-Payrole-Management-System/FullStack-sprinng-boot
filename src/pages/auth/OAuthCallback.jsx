// src/pages/auth/OAuthCallback.jsx
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage.service';

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    storageService.setTokens(accessToken, refreshToken);

    refreshUser()
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => {
        storageService.clearTokens();
        navigate('/login?error=oauth_failed', { replace: true });
      });
  }, [searchParams, navigate, refreshUser]);

  return (
    <AuthLayout eyebrow="SIGNING IN" title="Finishing sign in..." subtitle="Please wait a moment">
      <div className="d-flex justify-content-center py-4">
        <Spinner animation="border" />
      </div>
    </AuthLayout>
  );
}

export default OAuthCallback;