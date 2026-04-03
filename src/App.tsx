import { useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import PaymentReceipt from './pages/PaymentReceipt';
import Schedule from './pages/Schedule';
import Program from './pages/Program';
import Contact from './pages/Contact';
import PaymentSuccess from './pages/PaymentSuccess';
import RegisterPage from './pages/RegisterPage';
import Mentors from './pages/Mentors';
import Community from './pages/Community';
import BookSession from './pages/BookSession';
import Partners from './pages/Partners';
import SledgeMentorship from './pages/SledgeMentorship';
import SledgePlus from './pages/SledgePlus';
import SchedulePlus from './pages/SchedulePlus';
import RegisterPlusPage from './pages/RegisterPlusPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import License from './pages/License';
import { ContentProvider } from './contexts/ContentContext';

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
    <HelmetProvider>
      <ContentProvider>
        <Router>
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/payment" element={<RegisterPage />} />
            <Route path="/plus/payment" element={<RegisterPlusPage />} />
            <Route path="/register" element={<Navigate to="/payment" replace />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-receipt" element={<PaymentReceipt />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/plus/schedule" element={<SchedulePlus />} />
            <Route path="/program" element={<Program />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/community" element={<Community />} />
            <Route path="/book-a-session" element={<BookSession />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/mentorship" element={<SledgeMentorship />} />
            <Route path="/plus" element={<SledgePlus />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/license" element={<License />} />
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
      </ContentProvider>
    </HelmetProvider>
  );
}
