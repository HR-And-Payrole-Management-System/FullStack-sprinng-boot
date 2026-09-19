import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Upload, CheckCircle2, Trash2, ExternalLink, AlertTriangle, Clock } from 'lucide-react';

import EmployeePicker from '../performance/EmployeePicker';
import { employeeDocumentService } from '../../services/employeeDocument.service';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { resolveUploadUrl } from '../../utils/url';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import UploadDocumentModal from './UploadDocumentModal';
import VerifyDocumentModal from './VerifyDocumentModal';
import DOMPurify from "dompurify";

const STATUS_PILL = {
  PENDING: 'ent-pill-warning',
  VERIFIED: 'ent-pill-success',
  REJECTED: 'ent-pill-danger',
  EXPIRED: 'ent-pill-neutral',
};

function DocumentsPage() {
  const { showToast } = useToast();
  const { hasPermission } = useAuth();

  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [markingExpired, setMarkingExpired] = useState(false);
  const [markingExpiringSoon, setMarkingExpiringSoon] = useState(false);

  const loadDocuments = () => {
    if (!employee) return;
    setLoading(true);
    employeeDocumentService
      .fetchByEmployee(employee.id)
      .then(setDocuments)
      .catch(() => showToast('មិនអាចទាញយកឯកសារបានទេ', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(loadDocuments, [employee]);

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await employeeDocumentService.remove(pendingDeleteId);
      showToast('ឯកសារត្រូវបានលុប', 'success');
      loadDocuments();
    } catch {
      showToast('មិនអាចលុបឯកសារបានទេ', 'danger');
    } finally {
      setPendingDeleteId(null);
    }
  };

    const handleMarkExpired = async () => {
    setMarkingExpired(true);
    try {
      const count = await employeeDocumentService.markExpired();
      showToast(`បានធ្វើបច្ចុប្បន្នភាព ${count} ឯកសារជា Expired`, 'success');
      loadDocuments();
    } catch {
      showToast('មិនអាចធ្វើសកម្មភាពនេះបានទេ', 'danger');
    } finally {
      setMarkingExpired(false);
    }
  };

  const handleMarkExpiringSoon = async () => {
    setMarkingExpiringSoon(true);
    try {
      const count = await employeeDocumentService.markExpiringSoon(7);
      showToast(`បានផ្ញើ notification ចំនួន ${count} ឯកសារជិតផុតកំណត់`, 'success');
      loadDocuments();
    } catch {
      showToast('មិនអាចធ្វើសកម្មភាពនេះបានទេ', 'danger');
    } finally {
      setMarkingExpiringSoon(false);
    }
  };

  return (
    <div>
      <div className="ent-toolbar align-items-start">
        <div>
          <div className="ent-page-title">Documents</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Employee document uploads and verification
          </div>
        </div>
                {hasPermission('DOCUMENT_MANAGE') && (
          <div className="d-flex gap-2">
            <Button variant="outline-warning" onClick={handleMarkExpiringSoon} disabled={markingExpiringSoon}>
              <Clock size={16} className="me-1" />
              {markingExpiringSoon ? 'Checking...' : 'Check Expiring Soon'}
            </Button>
            <Button variant="outline-primary" onClick={handleMarkExpired} disabled={markingExpired}>
              <AlertTriangle size={16} className="me-1" />
              {markingExpired ? 'Checking...' : 'Mark Expired'}
            </Button>
          </div>
        )}
      </div>

      <div className="ent-card p-3 mb-3">
        <div className="mb-2" style={{ fontWeight: 600 }}>Select employee</div>
        <EmployeePicker value={employee} onSelect={setEmployee} />
      </div>

      {!employee ? (
        <div className="ent-card p-4">
          <EmptyState icon="🗂️" title="Select an employee to view their documents" />
        </div>
      ) : (
        <div className="ent-card p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div style={{ fontWeight: 600 }}>
              {employee.firstName} {employee.lastName}'s Documents
            </div>
            {hasPermission('DOCUMENT_CREATE') && (
              <Button variant="primary" size="sm" onClick={() => setUploadOpen(true)}>
                <Upload size={14} className="me-1" />
                Upload
              </Button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : documents.length === 0 ? (
            <EmptyState icon="📄" title="No documents uploaded yet" />
          ) : (
            <div className="d-flex flex-column gap-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="d-flex align-items-center justify-content-between p-3"
                  style={{
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontWeight: 600 }}>{doc.documentTypeName}</span>
                      <span className={`ent-pill ${STATUS_PILL[doc.status] || 'ent-pill-neutral'}`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="small text-muted">
                      {doc.documentNumber && <>No. {doc.documentNumber} · </>}
                      {doc.issueDate && <>Issued {doc.issueDate} · </>}
                      {doc.expiryDate && <>Expires {doc.expiryDate}</>}
                    </div>
                    {doc.verificationNote && (
                      <div className="small text-muted fst-italic">Note: {doc.verificationNote}</div>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    
                    <a  href={resolveUploadUrl(doc.fileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="ent-pill ent-pill-neutral"
                      style={{ textDecoration: 'none' }}
                    >
                      <ExternalLink size={12} className="me-1" />
                      {doc.fileName}
                    </a>

                    {doc.status === 'PENDING' && hasPermission('DOCUMENT_VERIFY') && (
                      <Button
                        size="sm"
                        variant="outline-success"
                        title="Verify"
                        onClick={() => setVerifyTarget(doc)}
                      >
                        <CheckCircle2 size={14} />
                      </Button>
                    )}

                    {hasPermission('DOCUMENT_DELETE') && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        title="Delete"
                        onClick={() => setPendingDeleteId(doc.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <UploadDocumentModal
        show={uploadOpen}
        employeeId={employee?.id}
        onClose={() => setUploadOpen(false)}
        onUploaded={loadDocuments}
      />

      <VerifyDocumentModal
        show={verifyTarget !== null}
        document={verifyTarget}
        onClose={() => setVerifyTarget(null)}
        onVerified={loadDocuments}
      />

      <ConfirmModal
        show={pendingDeleteId !== null}
        title="Delete document"
        body="Are you sure you want to delete this document? This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}

export default DocumentsPage;