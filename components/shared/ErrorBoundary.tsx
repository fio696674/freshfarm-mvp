"use client";

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Egg with sweat drop */}
            <span className="text-7xl" aria-hidden="true">
              🥚
              <span className="text-3xl">💦</span>
            </span>

            <h2 className="text-xl font-semibold text-stone-900">
              Something went wrong
            </h2>
            <p className="max-w-sm text-sm text-stone-500">
              We hit an unexpected snag. Don&apos;t worry — your eggs are safe.
              Try again or head back home.
            </p>

            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="rounded-full bg-terra-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terra-600 active:bg-terra-700"
              >
                Try Again
              </button>
              <a
                href="/"
                className="rounded-full border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
