import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BarChart3, Ticket, LogOut, Menu, X, Zap } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

const navItems = [
  { to: '/portal',          label: 'Overview',   icon: LayoutDashboard, end: true },
  { to: '/portal/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/portal/tickets',   label: 'Tickets',   icon: Ticket },
]

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      style={{ textDecoration: 'none' }}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={
              isActive
                ? { background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }
                : { background: 'rgba(255,255,255,0.05)' }
            }
          >
            <Icon size={15} color={isActive ? 'white' : '#6b7280'} />
          </div>
          {label}
        </>
      )}
    </NavLink>
  )
}

export default function PortalLayout({ children }) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    if (profile?.company_id) {
      supabase
        .from('companies')
        .select('company_name')
        .eq('id', profile.company_id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Failed to fetch company name:', error)
          } else if (data) {
            setCompanyName(data.company_name)
          }
        })
    }
  }, [profile?.company_id])

  async function handleSignOut() {
    await signOut()
    navigate('/portal/login')
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'ME'

  const Sidebar = ({ onClose }) => (
    <div
      className="flex flex-col h-full"
      style={{ background: '#080f1e', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
          >
            <Zap size={15} color="white" fill="white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">GrowthOps</p>
            <p className="text-xs" style={{ color: '#60a5fa' }}>Client Portal</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-600 hover:text-gray-400 lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Company name */}
      {companyName && (
        <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs text-gray-500">Viewing</p>
          <p className="text-sm font-semibold text-white truncate">{companyName}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(item => (
          <NavItem key={item.to} {...item} onClick={onClose} />
        ))}
      </nav>

      {/* User / sign out */}
      <div
        className="px-3 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
          >
            {initials}
          </div>
          <p className="text-xs text-gray-400 truncate flex-1">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <LogOut size={14} color="#6b7280" />
          </div>
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#060f1c' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0" style={{ width: '220px' }}>
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[220px] z-50">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#080f1e' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-300"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-white">GrowthOps Portal</span>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
