import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import { EventStateProvider } from './state/EventState';
import { Toaster } from './components/ui/Toaster';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useSocket } from './hooks/useSocket';

// Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { CreateEvent } from './pages/CreateEvent';
import { EditEvent } from './pages/EditEvent';
import { EventDetail } from './pages/EventDetail';
import { MyRegistrations } from './pages/MyRegistrations';

import './styles.css';

const SocketBootstrap = () => {
  useSocket();
  return null;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastProvider>
          <EventStateProvider>
            <NotificationProvider>
              <SocketBootstrap />
              <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/event/:id"
                element={
                  <ProtectedRoute>
                    <EventDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/events/:id"
                element={
                  <ProtectedRoute>
                    <EventDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/create-event"
                element={
                  <ProtectedRoute requiredRole="organizer">
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/events/:id/edit"
                element={
                  <ProtectedRoute requiredRole="organizer">
                    <EditEvent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit-event/:id"
                element={
                  <ProtectedRoute requiredRole="organizer">
                    <EditEvent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-registrations"
                element={
                  <ProtectedRoute>
                    <MyRegistrations />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              <Toaster />
            </NotificationProvider>
          </EventStateProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
