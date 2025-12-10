import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
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

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
                    <p className="text-muted-foreground mb-8 max-w-md">
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
                    </div>
                    {process.env.NODE_ENV === 'development' && (
                        <pre className="mt-8 p-4 bg-muted rounded text-left text-xs max-w-2xl overflow-auto">
                            {this.state.error?.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
