import { useState, useEffect } from 'react';

function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="text-center py-2"
      style={{ background: 'var(--color-danger)', color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 600 }}
    >
      ⚠️ គ្មាន Internet Connection — ទិន្នន័យអាចមិន Sync ថ្មីៗ
    </div>
  );
}

export default NetworkStatusBanner;