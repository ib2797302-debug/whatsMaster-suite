import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-white">
                Oups ! Une erreur est survenue
              </h2>
              <p className="text-muted-foreground">
                {this.state.error?.message || "Une erreur inattendue s'est produite."}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Rafraîchir
              </Button>
              <Button 
                onClick={this.handleReset}
                className="gap-2"
              >
                Retour au dashboard
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left mt-4 p-4 bg-black/40 rounded-lg text-xs font-mono text-muted-foreground overflow-auto max-h-48">
                <summary className="cursor-pointer mb-2 text-destructive">Détails techniques (dev only)</summary>
                <pre>{this.state.error.stack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
