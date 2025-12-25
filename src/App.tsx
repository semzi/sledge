import { useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PaymentReceipt from './components/PaymentReceipt';
import Schedule from './components/Schedule';
import Program from './components/Program';
import Contact from './components/Contact';
import PaymentSuccess from './components/PaymentSuccess';
import RegisterPage from './components/RegisterPage';

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash]);

  return null;
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const session = localStorage.getItem('admin_session');
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<RegisterPage />} />
        <Route path="/register" element={<Navigate to="/payment" replace />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-receipt" element={<PaymentReceipt />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/program" element={<Program />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
      </Routes>
    </Router>
  );
}
