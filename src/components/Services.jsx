import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Monitor,
  Bot,
  Users,
  Workflow,
  Search,
  PenTool,
  Target,
  Megaphone,
  Mail,
  TrendingUp,
  BarChart3,
  Wrench,
} from 'lucide-react'

const services = [
  {
    icon: Monitor,
    title: 'Custom Website Design & Development',
    description: 'Conversion-focused websites built to attract, engage, and convert visitors into enquiries.',
    color: '#60a5fa',
  },
  {
    icon: Bot,
    title: 'AI Chatbot Setup',
    description: 'Intelligent chatbots that handle enquiries, qualify leads, and book appointments around the clock.',
    color: '#a78bfa',
  },
  {
    icon: Users,
    title: 'CRM Setup & Optimisation',
    description: 'A structured pipeline that tracks every lead, surfaces follow-up tasks, and keeps your team aligned.',
    color: '#34d399',
  },
  {
    icon: Workflow,
    title: 'Business Process Automations',
    description: 'Automated workflows that eliminate repetitive admin — follow-ups, reminders, data entry, and more.',
    color: '#f59e0b',
  },
  {
    icon: Search,
    title: 'SEO Strategy',
    description: 'Organic search strategies built around the terms your ideal customers are actively searching for.',
    color: '#60a5fa',
  },
  {
    icon: PenTool,
    title: 'Content Creation',
    description: 'Authority-building content — articles, landing pages, case studies — that attracts and converts.',
    color: '#f472b6',
  },
  {
    icon: Target,
    title: 'Lead Generation',
    description: 'Multi-channel lead generation systems that fill your pipeline with qualified, trackable opportunities.',
    color: '#fb923c',
  },
  {
    icon: Megaphone,
    title: 'Paid Advertising',
    description: 'Google and Meta campaigns managed for performance — with clear reporting on every pound spent.',
    color: '#a78bfa',
  },
  {
    icon: Mail,
    title: 'Email & SMS Systems',
    description: 'Automated email and SMS sequences that nurture leads, recover lost enquiries, and drive repeat business.',
    color: '#34d399',
  },
  {
    icon: TrendingUp,
    title: 'Conversion Rate Optimisation',
    description: 'Systematic testing and improvements to your website and funnels that increase the yield from existing traffic.',
    color: '#f59e0b',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting Dashboards',
    description: 'Live dashboards that show exactly where your leads come from, what converts, and where to invest next.',
    color: '#60a5fa',
  },
  {
    icon: Wrench,
    title: 'Maintenance & Support',
    description: 'Ongoing technical maintenance, updates, and support so your systems stay fast, secure, and reliable.',
    color: '#94a3b8',
  },
]

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.05) 0%, transparent 60%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="section-label">
              Services
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Everything your business needs{' '}
              <span className="gradient-text">to grow.</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
              A complete suite of growth services, integrated into one strategy and delivered
              as a single system.
            </p>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <FadeUp key={s.title} delay={Math.min(i * 0.06, 0.5)}>
                <div
                  className="p-6 rounded-2xl h-full card-hover cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${s.color}18` }}
                  >
                    <Icon size={20} color={s.color} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
