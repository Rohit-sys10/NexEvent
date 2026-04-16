import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App crashed:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">NexEvent</p>
            <h1 className="mt-3 text-2xl font-semibold text-gray-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-gray-600">
              The page failed to render. Reload the app or return to the dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Reload app
              </button>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Go to dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}