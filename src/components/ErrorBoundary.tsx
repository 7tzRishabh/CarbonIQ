import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-100 max-w-md w-full">
            <h2 className="text-2xl font-bold text-rose-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. Please refresh the page or try again later.
            </p>
            <div className="bg-rose-50 p-4 rounded-xl text-sm font-mono text-rose-800 break-words mb-6 max-h-32 overflow-y-auto">
                {this.state.error?.message}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-rose-600 text-white rounded-xl py-3 font-medium hover:bg-rose-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
