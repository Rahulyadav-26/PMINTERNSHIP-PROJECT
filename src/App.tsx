import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { StudentProvider } from "@/contexts/StudentContext";

// Pages
import { Landing } from "./pages/Landing";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { StudentProfile } from "./pages/student/StudentProfile";
import { Skills } from "./pages/student/Skills";
import { Preferences } from "./pages/student/Preferences";
import { Resume } from "./pages/student/Resume";
import { Recommendations } from "./pages/student/Recommendations";
import { Applications } from "./pages/student/Applications";
import { Offers } from "./pages/student/Offers";
import { Consent } from "./pages/student/Consent";
import { AdminData } from "./pages/admin/AdminData";
import { MinistryBias } from "./pages/ministry/MinistryBias";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard redirect based on role
const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'student':
      return <Navigate to="/dashboard/profile" replace />;
    case 'admin':
      return <Navigate to="/admin/data" replace />;
    case 'ministry':
      return <Navigate to="/ministry/bias" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StudentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard Redirect */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } />
            
            {/* Student Routes */}
            <Route path="/dashboard/profile" element={
              <ProtectedRoute requiredRole="student">
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/skills" element={
              <ProtectedRoute requiredRole="student">
                <Skills />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/preferences" element={
              <ProtectedRoute requiredRole="student">
                <Preferences />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/resume" element={
              <ProtectedRoute requiredRole="student">
                <Resume />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/recommendations" element={
              <ProtectedRoute requiredRole="student">
                <Recommendations />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/applications" element={
              <ProtectedRoute requiredRole="student">
                <Applications />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/offers" element={
              <ProtectedRoute requiredRole="student">
                <Offers />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/consent" element={
              <ProtectedRoute requiredRole="student">
                <Consent />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/data" element={
              <ProtectedRoute requiredRole="admin">
                <AdminData />
              </ProtectedRoute>
            } />
            
            {/* Ministry Routes */}
            <Route path="/ministry/bias" element={
              <ProtectedRoute requiredRole="ministry">
                <MinistryBias />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </StudentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
