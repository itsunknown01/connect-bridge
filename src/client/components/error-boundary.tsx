import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./ui";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              We've encountered an unexpected error. Don't worry, your data is
              safe. Try refreshing the page or returning home.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 bg-[#12372A] hover:bg-[#12372A]/90 text-white"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Application
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-red-700 whitespace-pre-wrap">
                  {this.state.error?.stack}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
