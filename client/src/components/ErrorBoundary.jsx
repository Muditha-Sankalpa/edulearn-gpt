import { Component } from "react";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-full bg-accent-red/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-accent-red" />
            </div>
            <h1 className="text-text font-semibold text-lg mb-1">Something went wrong</h1>
            <p className="text-text-muted text-sm mb-5">
              An unexpected error occurred. Try reloading the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
