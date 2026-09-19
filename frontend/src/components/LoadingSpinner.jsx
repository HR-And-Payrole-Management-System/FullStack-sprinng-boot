import { Spinner } from 'react-bootstrap';

function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center py-3">
      <Spinner animation="border" size="sm" variant="primary" />
    </div>
  );
}

export default LoadingSpinner;