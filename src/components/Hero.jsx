import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

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

        {/* Benefit bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.07)' }}
        >
          {[
            { value: 'Faster follow-up', label: 'Respond to leads in minutes, not hours' },
            { value: 'Less admin', label: 'Automate repetitive tasks and free up time' },
            { value: 'Full visibility', label: 'Know exactly where every lead comes from' },
            { value: 'More conversions', label: 'Turn more enquiries into paying customers' },
          ].map((benefit) => (
            <div
              key={benefit.value}
              className="py-5 px-4 text-center"
              style={{ background: 'rgba(6,15,28,0.7)' }}
            >
              <div className="text-sm font-bold gradient-text leading-snug">{benefit.value}</div>
              <div className="text-xs text-gray-500 mt-1 font-medium leading-snug">{benefit.label}</div>
            </div>
          ))}
        </motion.div>
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
