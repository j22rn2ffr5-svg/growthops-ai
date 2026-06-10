import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import Chatbot from './components/Chatbot'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/portal/ProtectedRoute'
import PortalLayout from './components/portal/PortalLayout'

import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import CaseStudiesPage from './pages/CaseStudiesPage'
import ProcessPage from './pages/ProcessPage'
import PackagesPage from './pages/PackagesPage'
import ContactPage from './pages/ContactPage'
import BookPage from './pages/BookPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import NotFoundPage from './pages/NotFoundPage'

import LoginPage from './pages/portal/LoginPage'
import DashboardPage from './pages/portal/DashboardPage'
import TicketsPage from './pages/portal/TicketsPage'
import NewTicketPage from './pages/portal/NewTicketPage'
import AnalyticsPage from './pages/portal/AnalyticsPage'
import AdminDashboardPage from './pages/portal/admin/AdminDashboardPage'
import AdminTicketsPage from './pages/portal/admin/AdminTicketsPage'
import AdminEnquiriesPage from './pages/portal/admin/AdminEnquiriesPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function MainSite() {
  return (
    <div className="min-h-screen" style={{ background: '#060f1c' }}>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
      <Chatbot />
    </div>
  )
}

function PortalApp() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <PortalLayout>
              <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="tickets" element={<TicketsPage />} />
                <Route path="tickets/new" element={<NewTicketPage />} />
                <Route path="admin" element={<AdminDashboardPage />} />
                <Route path="admin/tickets" element={<AdminTicketsPage />} />
                <Route path="admin/enquiries" element={<AdminEnquiriesPage />} />
                <Route path="*" element={<Navigate to="/portal" replace />} />
              </Routes>
            </PortalLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/portal/*" element={<PortalApp />} />
            <Route path="/*" element={<MainSite />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
