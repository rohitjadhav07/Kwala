import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ChainQuest Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="dashboard-card" style={{ 
          textAlign: 'center', 
          margin: '2rem auto', 
          maxWidth: '600px',
          background: 'rgba(255, 107, 107, 0.1)',
          border: '1px solid rgba(255, 107, 107, 0.3)'
        }}>
          <h2 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>
            🚨 Something went wrong
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            ChainQuest encountered an unexpected error. Don't worry, your data is safe!
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary>Error Details (Development)</summary>
              <pre style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '1rem', 
                borderRadius: '8px',
                fontSize: '0.875rem',
                overflow: 'auto'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;