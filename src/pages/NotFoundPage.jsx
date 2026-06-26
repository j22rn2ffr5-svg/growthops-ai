import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Home } from 'lucide-react'
import SEO from '../components/SEO'

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="This page doesn't exist." path="/404" />
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <div
            className="inline-block text-8xl font-extrabold mb-6"
            style={{
              background: 'linear-gradient(135deg, #60a5fa, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            This page doesn't exist
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-10">
            You may have followed an old link or mistyped the URL. Either way, let's get you
            somewhere useful.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="btn-primary text-sm px-6 py-3"
              style={{ textDecoration: 'none' }}
            >
              <Home size={16} />
              Back to home
            </Link>
            <Link
              to="/book"
              className="btn-secondary text-sm px-6 py-3"
              style={{ textDecoration: 'none' }}
            >
              Book a strategy call
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  )
}
