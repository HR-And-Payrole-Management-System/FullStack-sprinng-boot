import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function RatingInput({ label, value, onChange, disabled }) {
  return (
    <Form.Group className="mb-2">
      <Form.Label className="small fw-semibold d-flex justify-content-between">
        <span>{label}</span>
        <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{Number(value).toFixed(2)} / 5.00</span>
      </Form.Label>
      <Form.Range min="1" max="5" step="0.25" value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} />
    </Form.Group>
  );
}

function ScoreBlock({ label, value, color }) {
  return (
    <div className="text-center">
      <div className="text-muted small">{label}</div>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color }}>
        {value != null ? Number(value).toFixed(2) : '—'}
      </div>
    </div>
  );
}

function ReviewCard({ review, canSelfReview, canManagerReview, onSelfReview, onManagerReview, onComplete }) {
  const [selfRating, setSelfRating] = useState(Number(review?.selfRating) || 3);
  const [selfComment, setSelfComment] = useState(review?.selfComment || '');
  const [mgrRating, setMgrRating] = useState(Number(review?.managerRating) || 3);
  const [mgrComment, setMgrComment] = useState(review?.managerComment || '');
  const [savingSelf, setSavingSelf] = useState(false);
  const [savingMgr, setSavingMgr] = useState(false);
  const [completing, setCompleting] = useState(false);

  const status = review?.status || 'PENDING';

  const submitSelf = async () => {
    setSavingSelf(true);
    try { await onSelfReview({ rating: selfRating, comment: selfComment }); }
    finally { setSavingSelf(false); }
  };

  const submitManager = async () => {
    setSavingMgr(true);
    try { await onManagerReview({ rating: mgrRating, comment: mgrComment }); }
    finally { setSavingMgr(false); }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try { await onComplete(); }
    finally { setCompleting(false); }
  };

  return (
    <div className="ent-card p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ fontWeight: 700 }}>Performance Review</div>
        <span className={`ent-pill ${status === 'COMPLETED' ? 'ent-pill-success' : status === 'PENDING' ? 'ent-pill-neutral' : 'ent-pill-warning'}`}>
          {status}
        </span>
      </div>

      <div className="d-flex gap-4 mb-4 justify-content-around ent-card p-3" style={{ background: 'var(--color-bg)' }}>
        <ScoreBlock label="Goal Score" value={review?.goalScore} color="var(--color-primary)" />
        <ScoreBlock label="Self Rating" value={review?.selfRating} color="var(--color-text)" />
        <ScoreBlock label="Manager Rating" value={review?.managerRating} color="var(--color-text)" />
        <ScoreBlock label="Final Score" value={review?.finalScore} color="var(--color-success)" />
      </div>

      <Row2>
        <div>
          <div className="fw-semibold small mb-2">Self Review</div>
          <RatingInput label="Self Rating" value={selfRating} onChange={setSelfRating} disabled={!canSelfReview} />
          <Form.Control
            as="textarea" rows={3} placeholder="Self comment..."
            value={selfComment} onChange={(e) => setSelfComment(e.target.value)}
            disabled={!canSelfReview} className="mb-2"
          />
          {canSelfReview && (
            <Button size="sm" className="ent-btn-primary" disabled={savingSelf} onClick={submitSelf}>
              {savingSelf ? 'Saving...' : 'Submit Self Review'}
            </Button>
          )}
        </div>
        <div>
          <div className="fw-semibold small mb-2">Manager Review</div>
          <RatingInput label="Manager Rating" value={mgrRating} onChange={setMgrRating} disabled={!canManagerReview} />
          <Form.Control
            as="textarea" rows={3} placeholder="Manager comment..."
            value={mgrComment} onChange={(e) => setMgrComment(e.target.value)}
            disabled={!canManagerReview} className="mb-2"
          />
          {canManagerReview && (
            <Button size="sm" className="ent-btn-primary" disabled={savingMgr} onClick={submitManager}>
              {savingMgr ? 'Saving...' : 'Submit Manager Review'}
            </Button>
          )}
        </div>
      </Row2>

      {canManagerReview && status === 'MANAGER_REVIEWED' && (
        <div className="text-end mt-3">
          <Button variant="success" disabled={completing} onClick={handleComplete}>
            {completing ? 'Completing...' : '✓ Mark Review Complete'}
          </Button>
        </div>
      )}
    </div>
  );
}

function Row2({ children }) {
  return <div className="row g-4">{children.map((c, i) => <div className="col-md-6" key={i}>{c}</div>)}</div>;
}

export default ReviewCard;