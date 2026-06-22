import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Calendar, FileText, BookOpen } from 'lucide-react'
import AICopyTool      from '../../components/portal/marketing/AICopyTool'
import ContentCalendar from '../../components/portal/marketing/ContentCalendar'
import CampaignBriefs  from '../../components/portal/marketing/CampaignBriefs'
import ContentLibrary  from '../../components/portal/marketing/ContentLibrary'

const TABS = [
  { id: 'copy',     label: 'AI Copy',          icon: Sparkles,  desc: 'Generate social posts, ad copy, email subjects and more.' },
  { id: 'calendar', label: 'Content Calendar',  icon: Calendar,  desc: 'Plan and schedule your content across every channel.' },
  { id: 'briefs',   label: 'Campaign Briefs',   icon: FileText,  desc: 'Build structured briefs for upcoming campaigns.' },
  { id: 'library',  label: 'Content Library',   icon: BookOpen,  desc: 'All content Stragyx has produced for your business.' },
]

export default function MarketingPage() {
  const [active, setActive] = useState('copy')
  const tab = TABS.find(t => t.id === active)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">Marketing</h1>
        <p className="text-sm text-gray-500">{tab?.desc}</p>
      </motion.div>

      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {TABS.map(t => {
          const Icon = t.icon
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={isActive
                ? { background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }
                : { color: '#6b7280' }
              }
            >
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
      </motion.div>

      {/* Content */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {active === 'copy'     && <AICopyTool />}
        {active === 'calendar' && <ContentCalendar />}
        {active === 'briefs'   && <CampaignBriefs />}
        {active === 'library'  && <ContentLibrary />}
      </motion.div>
    </div>
  )
}
