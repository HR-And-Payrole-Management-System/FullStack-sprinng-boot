import { Card } from 'react-bootstrap';

function StatCard({ label, value, icon, variant = 'primary' }) {
  return (
    <Card className={`border-start border-4 border-${variant} shadow-sm h-100`}>
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fs-3 fw-bold">{value ?? '—'}</div>
        </div>
        <div className="fs-1">{icon}</div>
      </Card.Body>
    </Card>
  );
}

export default StatCard;