import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a real production setup, send this to a logging service.
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h4 className="mt-2">មានបញ្ហាមិនរំពឹងទុកកើតឡើង</h4>
          <p className="text-muted small">សូមព្យាយាម Reload ទំព័រម្តងទៀត</p>
          <button className="ent-btn-primary" style={{ border: 'none' }} onClick={this.handleReload}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;