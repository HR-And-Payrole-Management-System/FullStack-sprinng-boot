import { Link } from 'react-router-dom';

function Forbidden() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold text-danger">403</h1>
      <p className="fs-4">អ្នកគ្មានសិទ្ធិចូលមើលទំព័រនេះទេ</p>
      <Link to="/dashboard" className="btn btn-secondary mt-3">
        ត្រឡប់ទៅ Dashboard
      </Link>
    </div>
  );
}

export default Forbidden;