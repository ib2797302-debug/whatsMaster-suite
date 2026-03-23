import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/hooks/use-theme";
import { useApiInterceptor } from "@/hooks/use-api-interceptor";
import NotFound from "@/pages/not-found";

// Lazy-loaded pages for better performance
const LandingPage = lazy(() => import("@/pages/landing"));
const LoginPage = lazy(() => import("@/pages/login"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const InboxPage = lazy(() => import("@/pages/inbox"));
const ContactsPage = lazy(() => import("@/pages/contacts"));
const CampaignsPage = lazy(() => import("@/pages/campaigns"));
const AnalyticsPage = lazy(() => import("@/pages/analytics"));
const AdminPage = lazy(() => import("@/pages/admin"));
const SettingsPage = lazy(() => import("@/pages/settings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading fallback component with accessibility
function PageLoadingFallback() {
  return (
    <div 
      className="min-h-screen bg-background flex items-center justify-center" 
      role="status" 
      aria-live="polite"
      aria-label="Chargement de la page"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground sr-only">Chargement en cours...</span>
      </div>
    </div>
  );
}

interface ProtectedRouteProps {
  component: React.ComponentType;
  routeName: string;
}

function ProtectedRoute({ component: Component, routeName }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        
        {/* Protected Routes with route names for accessibility */}
        <Route path="/dashboard">
          <ProtectedRoute component={DashboardPage} routeName="Tableau de bord" />
        </Route>
        <Route path="/inbox">
          <ProtectedRoute component={InboxPage} routeName="Boîte de réception" />
        </Route>
        <Route path="/contacts">
          <ProtectedRoute component={ContactsPage} routeName="Contacts" />
        </Route>
        <Route path="/campaigns">
          <ProtectedRoute component={CampaignsPage} routeName="Campagnes" />
        </Route>
        <Route path="/analytics">
          <ProtectedRoute component={AnalyticsPage} routeName="Analytiques" />
        </Route>
        <Route path="/admin">
          <ProtectedRoute component={AdminPage} routeName="Administration" />
        </Route>
        <Route path="/settings">
          <ProtectedRoute component={SettingsPage} routeName="Paramètres" />
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// Component that uses the API interceptor hook
function AppContent() {
  // Initialize API interceptor for automatic auth error handling
  useApiInterceptor();
  
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ThemeProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </WouterRouter>
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
