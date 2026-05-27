import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, TrendingUp, Zap, BarChart3, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const floatingCards = [
  {
    icon: TrendingUp,
    label: 'More Leads',
    value: '+38%',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.2)',
    delay: 0,
    position: 'top-24 left-6 md:left-12',
  },
  {
    icon: Clock,
    label: 'Faster Follow-Up',
    value: '<2 min',
    color: '#a78bfa',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.2)',
    delay: 1,
    position: 'top-24 right-6 md:right-12',
  },
  {
    icon: Zap,
    label: 'Automated Workflows',
    value: '15+ hrs/wk',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.2)',
    delay: 2,
    position: 'bottom-40 left-6 md:left-12',
  },
  {
    icon: BarChart3,
    label: 'Clear Reporting',
    value: 'Live',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
    delay: 1.5,
    position: 'bottom-40 right-6 md:right-12',
  },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      {/* Floating stat cards */}
      {floatingCards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { delay: card.delay + 1, duration: 0.6 },
              y: { delay: card.delay + 1, duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className={`absolute hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl ${card.position}`}
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${card.color}22` }}
            >
              <Icon size={18} color={card.color} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium leading-none mb-1">{card.label}</div>
              <div className="text-base font-bold text-white leading-none">{card.value}</div>
            </div>
          </motion.div>
        )
      })}

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex justify-center"
        >
          <span className="section-label">
            <Zap size={12} />
            AI Growth Systems for SMBs
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.07] tracking-tight text-white mb-6"
        >
          AI growth systems for SMBs{' '}
          <span className="gradient-text">tired of losing leads to manual follow-up</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10"
        >
          We help small and mid-sized businesses connect their website, CRM, automations, and
          follow-up into one practical revenue system — so more enquiries turn into booked calls,
          quotes, and customers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/book" className="btn-primary" style={{ textDecoration: 'none' }}>
            Book a Free Strategy Call
            <ArrowRight size={16} />
          </Link>
          <Link to="/process" className="btn-secondary" style={{ textDecoration: 'none' }}>
            See How It Works
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-xs text-gray-600 mt-4"
        >
          Free consultation · No pressure · No hard sell
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-xs text-gray-600 mt-2"
        >
          Built for service businesses, local teams, and growing SMBs that need practical systems — not another dashboard.
        </motion.p>

        {/* Stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.07)' }}
        >
          {[
            { value: '38%', label: 'Avg. lead increase' },
            { value: '< 2 min', label: 'Follow-up time' },
            { value: '15 hrs', label: 'Admin saved/week' },
            { value: '3×', label: 'More qualified enquiries' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="py-5 px-4 text-center"
              style={{ background: 'rgba(6,15,28,0.7)' }}
            >
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Stat disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="text-xs text-gray-700 mt-3"
        >
          Figures represent typical outcomes from example growth systems. Individual results vary.
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.5, duration: 0.6 }, y: { delay: 1.5, duration: 2, repeat: Infinity } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600"
        aria-hidden="true"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}
