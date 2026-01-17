"use client";

import { Component, type ReactNode } from "react";
import Button from "@/components/ui/Button";

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
    /** Child components to render */
    children: ReactNode;
    /** Custom fallback UI (optional) */
    fallback?: ReactNode;
    /** Section name for error reporting */
    section?: string;
    /** Called when error is caught */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors in child component tree and displays fallback UI.
 * Follows React error boundary pattern for resilience.
 * 
 * Features:
 * - Graceful degradation on component crashes
 * - Optional custom fallback UI
 * - Error reporting callback for logging
 * - Section identification for debugging
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary section="ProductCarousel" onError={logToService}>
 *   <ProductCarousel products={products} />
 * </ErrorBoundary>
 * ```
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log error to console in development
        console.error(`[ErrorBoundary${this.props.section ? ` - ${this.props.section}` : ""}]`, error, errorInfo);

        // Call optional error handler for external logging
        this.props.onError?.(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div
                    className="flex flex-col items-center justify-center p-8 text-center bg-subtle border border-border rounded-lg"
                    role="alert"
                    aria-live="assertive"
                >
                    <p className="type-body-strong text-foreground mb-2">
                        Something went wrong
                    </p>
                    <p className="type-body text-muted mb-4">
                        {this.props.section
                            ? `Unable to load ${this.props.section}`
                            : "An error occurred while loading this section"}
                    </p>
                    <Button type="button" variant="secondary" onClick={this.handleReset}>
                        Try Again
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
