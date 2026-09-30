import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/Toast';

// Single Unified Login Page with persona selection tabs
import { UnifiedLoginPage } from './pages/UnifiedLoginPage';

// Portal Dashboard Pages
import { GovernmentDashboardPage } from './pages/GovernmentDashboardPage';
import { TrainingProviderDashboardPage } from './pages/TrainingProviderDashboardPage';
import { EmployerPortalDashboardPage } from './pages/EmployerPortalDashboardPage';
import { TraineePortalDashboardPage } from './pages/TraineePortalDashboardPage';
import { TraineeLoginPage } from './pages/TraineeLoginPage';

// Public Verification Survey (SMS/WhatsApp Token Link)
import { PublicSurveyPage } from './pages/PublicSurveyPage';

// DigiLocker OAuth2 Callback Page
import { DigiLockerCallbackPage } from './pages/DigiLockerCallbackPage';

const SurveyRouteWrapper: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  return <PublicSurveyPage token={token || 'demo_token'} onBackToApp={() => navigate('/')} />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="relative min-h-screen font-sans antialiased" style={{ backgroundColor: 'var(--gov-bg)', color: 'var(--gov-text)' }}>
          <Routes>
            {/* Unified Login Page: Single page with Trainee / User, Government Admin, Employer, and ITI tabs */}
            <Route path="/" element={<UnifiedLoginPage />} />
            <Route path="/login" element={<UnifiedLoginPage />} />

            {/* Seamless redirects from individual login URLs to portal login pages */}
            <Route path="/government/login" element={<Navigate to="/login?role=govt_admin" replace />} />
            <Route path="/training/login" element={<Navigate to="/login?role=training_provider" replace />} />
            <Route path="/employer/login" element={<Navigate to="/login?role=employer" replace />} />
            
            {/* Dedicated Real Trainee Login Route */}
            <Route path="/trainee/login" element={<Navigate to="/login?role=trainee" replace />} />

            {/* 1. Government Admin Dashboard */}
            <Route
              path="/government/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={['govt_admin', 'analyst']}
                  loginPath="/login?role=govt_admin"
                  roleTitle="Government Administrator"
                >
                  <GovernmentDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 2. Training Provider / ITI Dashboard */}
            <Route
              path="/training/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={['training_provider', 'provider']}
                  loginPath="/login?role=training_provider"
                  roleTitle="Training Provider / ITI"
                >
                  <TrainingProviderDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 3. Employer / Industry Partner Dashboard */}
            <Route
              path="/employer/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={['employer']}
                  loginPath="/login?role=employer"
                  roleTitle="Employer / Industry Partner"
                >
                  <EmployerPortalDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 4. Certified Trainee Portal Routes */}
            {[
              '/trainee/dashboard',
              '/trainee/profile',
              '/trainee/education',
              '/trainee/documents',
              '/trainee/skills',
              '/trainee/skill-gaps',
              '/trainee/jobs',
              '/trainee/recommendations',
              '/trainee/career',
              '/trainee/training',
              '/trainee/assessments',
              '/trainee/certifications',
              '/trainee/employment',
              '/trainee/follow-up',
              '/trainee/wage',
              '/trainee/opportunities',
              '/trainee/notifications',
              '/trainee/privacy',
              '/trainee/:tab'
            ].map((routePath) => (
              <Route
                key={routePath}
                path={routePath}
                element={
                  <ProtectedRoute
                    allowedRoles={['trainee']}
                    loginPath="/login?role=trainee"
                    roleTitle="Certified Trainee"
                  >
                    <TraineePortalDashboardPage />
                  </ProtectedRoute>
                }
              />
            ))}

            {/* External / Public Survey Link */}
            <Route path="/survey/:token" element={<SurveyRouteWrapper />} />

            {/* DigiLocker OAuth2 Redirect Callback */}
            <Route path="/digilocker/callback" element={<DigiLockerCallbackPage />} />

            {/* Legacy Dashboard aliases */}
            <Route path="/admin/*" element={<Navigate to="/government/dashboard" replace />} />
            <Route path="/dashboard" element={<Navigate to="/government/dashboard" replace />} />

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Premium Floating Notification Toasts */}
          <ToastContainer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
