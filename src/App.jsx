import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import Chatbot from './components/Chatbot'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/portal/ProtectedRoute'
import PortalLayout from './components/portal/PortalLayout'

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return null
  if (!isAdmin) return <Navigate to="/portal" replace />
  return children
}

const HomePage        = lazy(() => import('./pages/HomePage'))
const ServicesPage    = lazy(() => import('./pages/ServicesPage'))
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'))
const ProcessPage     = lazy(() => import('./pages/ProcessPage'))
const PackagesPage    = lazy(() => import('./pages/PackagesPage'))
const ContactPage     = lazy(() => import('./pages/ContactPage'))
const BookPage        = lazy(() => import('./pages/BookPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsPage       = lazy(() => import('./pages/TermsPage'))
const CookiePolicyPage  = lazy(() => import('./pages/CookiePolicyPage'))
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage'))

const LoginPage       = lazy(() => import('./pages/portal/LoginPage'))
const DashboardPage   = lazy(() => import('./pages/portal/DashboardPage'))
const TicketsPage     = lazy(() => import('./pages/portal/TicketsPage'))
const NewTicketPage        = lazy(() => import('./pages/portal/NewTicketPage'))
const TicketDetailPage     = lazy(() => import('./pages/portal/TicketDetailPage'))
const AnalyticsPage   = lazy(() => import('./pages/portal/AnalyticsPage'))
const SettingsPage        = lazy(() => import('./pages/portal/SettingsPage'))
const MarketingPage       = lazy(() => import('./pages/portal/MarketingPage'))
const WebsitePage         = lazy(() => import('./pages/portal/WebsitePage'))
const PerformancePage     = lazy(() => import('./pages/portal/PerformancePage'))
const PipelinePage        = lazy(() => import('./pages/portal/PipelinePage'))
const AutomationsPage     = lazy(() => import('./pages/portal/AutomationsPage'))
const AdminDashboardPage  = lazy(() => import('./pages/portal/admin/AdminDashboardPage'))
const AdminTicketsPage    = lazy(() => import('./pages/portal/admin/AdminTicketsPage'))
const AdminEnquiriesPage  = lazy(() => import('./pages/portal/admin/AdminEnquiriesPage'))
const AdminClientsPage       = lazy(() => import('./pages/portal/admin/AdminClientsPage'))
const AdminClientDetailPage  = lazy(() => import('./pages/portal/admin/AdminClientDetailPage'))
const ReportsPage            = lazy(() => import('./pages/portal/ReportsPage'))

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
        <Suspense fallback={null}>
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
        </Suspense>
      </main>
      <Footer />
      <CookieConsent />
      <Chatbot />
    </div>
  )
}

function PortalApp() {
  return (
    <Suspense fallback={null}>
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
                  <Route path="tickets/:id" element={<TicketDetailPage />} />
                  <Route path="performance"  element={<PerformancePage />} />
                  <Route path="pipeline"     element={<PipelinePage />} />
                  <Route path="automations"  element={<AutomationsPage />} />
                  <Route path="marketing"    element={<MarketingPage />} />
                  <Route path="website"      element={<WebsitePage />} />
                  <Route path="reports"      element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                  <Route path="admin/tickets" element={<AdminRoute><AdminTicketsPage /></AdminRoute>} />
                  <Route path="admin/enquiries" element={<AdminRoute><AdminEnquiriesPage /></AdminRoute>} />
                  <Route path="admin/clients" element={<AdminRoute><AdminClientsPage /></AdminRoute>} />
                  <Route path="admin/clients/:clientId" element={<AdminRoute><AdminClientDetailPage /></AdminRoute>} />
                  <Route path="*" element={<Navigate to="/portal" replace />} />
                </Routes>
              </PortalLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
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
