import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const LinkedInIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export default function Founder() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(124,58,237,0.06) 100%)',
            border: '1px solid rgba(96,165,250,0.15)',
          }}
        >
          <div className="grid md:grid-cols-5 gap-0">
            {/* Avatar / identity column */}
            <div
              className="md:col-span-2 flex flex-col items-center justify-center p-10 md:p-12"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Placeholder avatar ring */}
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center mb-5 text-4xl font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(124,58,237,0.25))',
                  border: '2px solid rgba(96,165,250,0.3)',
                  color: '#60a5fa',
                }}
              >
                CE
              </div>
              <p className="text-white font-bold text-xl leading-tight text-center">Chris Eyres</p>
              <p className="text-gray-400 text-sm mt-1 text-center">Founder, Stragyx</p>
              <a
                href="https://www.linkedin.com/company/stragyx"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(96,165,250,0.2)',
                  color: '#60a5fa',
                  textDecoration: 'none',
                }}
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            </div>

            {/* Bio column */}
            <div className="md:col-span-3 p-10 md:p-12 flex flex-col justify-center">
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: '#60a5fa' }}
              >
                About
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-5">
                Built by someone who's{' '}
                <span className="gradient-text">been in the weeds</span>
              </h2>
              <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                <p>
                  Stragyx was founded by Chris Eyres after spending years helping SMBs fix the
                  same recurring problems — scattered lead data, slow follow-up, marketing with no
                  visibility, and admin eating the day.
                </p>
                <p>
                  Most businesses don't need more software. They need the right systems, connected
                  properly, built around how they actually work. That's what Stragyx does.
                </p>
                <p>
                  The focus is simple: AI tools, CRM pipelines, and automation workflows that make
                  your business faster to respond, easier to run, and clearer to measure — without
                  the overhead of an in-house team.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  to="/book"
                  className="btn-primary text-sm px-6 py-3"
                  style={{ textDecoration: 'none' }}
                >
                  Book a Free Strategy Call
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
