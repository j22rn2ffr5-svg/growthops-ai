import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Globe, Wrench, BookOpen, Users, Search } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import WebsiteAdminTab     from '../../../components/portal/admin/WebsiteAdminTab'
import MaintenanceAdminTab from '../../../components/portal/admin/MaintenanceAdminTab'
import ContentAdminTab     from '../../../components/portal/admin/ContentAdminTab'
import LeadsAdminTab       from '../../../components/portal/admin/LeadsAdminTab'
import SeoAdminTab         from '../../../components/portal/admin/SeoAdminTab'

const TABS = [
  { id: 'website',     label: 'Website',     icon: Globe    },
  { id: 'maintenance', label: 'Maintenance',  icon: Wrench   },
  { id: 'content',     label: 'Content',      icon: BookOpen },
  { id: 'leads',       label: 'Leads',        icon: Users    },
  { id: 'seo',         label: 'SEO',          icon: Search   },
]

export default function AdminClientDetailPage() {
  const { clientId } = useParams()
  const [client, setClient]   = useState(null)
  const [active, setActive]   = useState('website')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('client_profiles').select('*').eq('id', clientId).single()
      .then(({ data }) => { setClient(data); setLoading(false) })
  }, [clientId])

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="flex gap-2">
        {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i*0.15}s` }} />)}
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/portal/admin/clients" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>
        <ArrowLeft size={14} /> All clients
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">{client?.business_name ?? 'Client'}</h1>
        <p className="text-sm text-gray-500">{client?.package ?? 'No package'} · Portal data management</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-wrap gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {TABS.map(t => {
          const Icon = t.icon
          const isActive = active === t.id
          return (
            <button key={t.id} onClick={() => setActive(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={isActive ? { background: 'rgba(59,130,246,0.2)', color: '#93c5fd' } : { color: '#6b7280' }}>
              <Icon size={14} />{t.label}
            </button>
          )
        })}
      </motion.div>

      <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {active === 'website'     && <WebsiteAdminTab     clientId={clientId} />}
        {active === 'maintenance' && <MaintenanceAdminTab clientId={clientId} />}
        {active === 'content'     && <ContentAdminTab     clientId={clientId} />}
        {active === 'leads'       && <LeadsAdminTab       clientId={clientId} />}
        {active === 'seo'         && <SeoAdminTab         clientId={clientId} />}
      </motion.div>
    </div>
  )
}
