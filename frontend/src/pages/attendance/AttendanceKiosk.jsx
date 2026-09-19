import { useEffect, useRef, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';

import { attendanceQrService } from '../../services/attendanceQr.service';
import { branchService } from '../../services/branch.service';
import { useToast } from '../../context/ToastContext';

function AttendanceKiosk() {
  const { showToast } = useToast();
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const [branchLoading, setBranchLoading] = useState(true);
  const [tokenData, setTokenData] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const countdownRef = useRef(null);

  useEffect(() => {
    branchService.list()
      .then((list) => {
        setBranches(list);
        if (list.length > 0) setBranchId(list[0].id);
      })
      .catch(() => showToast('មិនអាចទាញយកបញ្ជីសាខាបានទេ', 'danger'))
      .finally(() => setBranchLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchToken = (id) => {
    if (!id) return;
    attendanceQrService.getToken(id)
      .then((data) => {
        setTokenData(data);
        const secs = Math.max(1, Math.round((new Date(data.expiresAt) - new Date()) / 1000));
        setSecondsLeft(secs);
      })
      .catch(() => showToast('មិនអាចបង្កើត QR កូដបានទេ', 'danger'));
  };

  useEffect(() => {
    fetchToken(branchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  useEffect(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          fetchToken(branchId);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData, branchId]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '75vh' }}>
      <div className="ent-card p-4 text-center" style={{ maxWidth: 440, width: '100%' }}>
        <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }} className="mb-1">
          ស្កេនដើម្បី Check In / Check Out
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }} className="mb-3">
          Scan to Check In / Out
        </div>

        <Form.Select
          size="sm"
          className="mb-3"
          value={branchId ?? ''}
          disabled={branchLoading}
          onChange={(e) => setBranchId(Number(e.target.value))}
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </Form.Select>

        {tokenData ? (
          <>
            <div className="d-flex justify-content-center bg-white p-3 rounded mb-3">
              <QRCodeSVG value={tokenData.token} size={260} level="M" />
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              កូដថ្មីក្នុងរយៈពេល {secondsLeft} វិនាទី
            </div>
          </>
        ) : (
          <div className="py-5"><Spinner animation="border" size="sm" /></div>
        )}
      </div>
    </div>
  );
}

export default AttendanceKiosk;