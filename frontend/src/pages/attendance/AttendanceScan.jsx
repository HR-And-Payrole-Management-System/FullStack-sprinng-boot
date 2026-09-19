import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Html5Qrcode } from 'html5-qrcode';

import { attendanceQrService } from '../../services/attendanceQr.service';
import { useToast } from '../../context/ToastContext';

const SCANNER_ELEMENT_ID = 'attendance-qr-scanner';

function formatTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function AttendanceScan() {
  const { showToast } = useToast();
  const scannerRef = useRef(null);
  const processingRef = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    return () => { stopScanner(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch { /* already stopped */ }
      scannerRef.current = null;
    }
  };

  const handleDecoded = async (decodedText) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setProcessing(true);
    await stopScanner();
    setScanning(false);

    try {
      const res = await attendanceQrService.scan(decodedText);
      setResult(res);
      showToast(res.checkOutTime ? 'Check-out ជោគជ័យ' : 'Check-in ជោគជ័យ', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'មិនអាចស្កេនកូដនេះបានទេ', 'danger');
    } finally {
      setProcessing(false);
      processingRef.current = false;
    }
  };

  const startScanner = async () => {
    setResult(null);
    setScanning(true);
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        handleDecoded,
        () => {}
      );
    } catch {
      showToast('មិនអាចប្រើកាមេរ៉ាបានទេ សូមអនុញ្ញាតការចូលប្រើកាមេរ៉ា', 'danger');
      setScanning(false);
    }
  };

  const cancelScanner = async () => {
    await stopScanner();
    setScanning(false);
  };

  return (
    <div className="d-flex flex-column align-items-center" style={{ maxWidth: 420, margin: '0 auto' }}>
      <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }} className="mb-3 text-center">
        ស្កេន QR ដើម្បីកត់ត្រាម៉ោង
        <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: 400 }}>
          Scan Attendance QR
        </div>
      </div>

      <div className="ent-card p-3 w-100">
        <div id={SCANNER_ELEMENT_ID} style={{ width: '100%', minHeight: 260, borderRadius: 8, overflow: 'hidden' }} />

        {!scanning && (
          <Button className="ent-btn-primary mt-3 w-100" onClick={startScanner} disabled={processing}>
            {processing ? 'កំពុងដំណើរការ...' : 'បើកកាមេរ៉ា / Start Camera'}
          </Button>
        )}

        {scanning && (
          <Button variant="light" className="mt-3 w-100" onClick={cancelScanner}>
            បោះបង់ / Cancel
          </Button>
        )}
      </div>

      {result && (
        <div className="ent-card p-3 mt-3 w-100 text-center">
          <div style={{ fontWeight: 700 }}>
            {result.checkOutTime ? 'Checked Out ✅' : 'Checked In ✅'}
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            {result.workDate} — {formatTime(result.checkInTime)}
            {result.checkOutTime ? ` → ${formatTime(result.checkOutTime)}` : ''}
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceScan;