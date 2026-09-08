import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <p className="fs-4">មិនរកទំព័រនេះឃើញទេ</p>
      <Link to="/dashboard" className="btn btn-primary mt-3">
        ត្រឡប់ទៅ Dashboard
      </Link>
    </div>
  );
}

export default NotFound;