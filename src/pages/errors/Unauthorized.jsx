import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold text-warning">401</h1>
      <p className="fs-4">សូម Login ជាមុនសិន</p>
      <Link to="/login" className="btn btn-primary mt-3">
        ទៅកាន់ Login
      </Link>
    </div>
  );
}

export default Unauthorized;