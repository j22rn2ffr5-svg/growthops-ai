import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center relative rounded-3xl overflow-hidden py-16 px-8"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.12) 100%)',
          border: '1px solid rgba(96,165,250,0.2)',
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
            Ready to build a smarter{' '}
            <span className="gradient-text">growth system?</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
            Let's identify where your business is losing leads, wasting time, or missing revenue
            opportunities — and build the systems to fix it.
          </p>
          <Link
            to="/book"
            className="btn-primary inline-flex text-base px-8 py-4"
            style={{ textDecoration: 'none' }}
          >
            Book a Free Strategy Call
            <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No pressure, no hard sell. If we don't think we can help, we'll say so on the call.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
