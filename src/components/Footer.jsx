import { Link } from 'react-router-dom'
import Logo from './Logo'

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const footerLinks = {
  Services: [
    { label: 'Website Design', to: '/services' },
    { label: 'AI Chatbot', to: '/services' },
    { label: 'CRM Setup', to: '/services' },
    { label: 'Business Automation', to: '/services' },
    { label: 'SEO Strategy', to: '/services' },
    { label: 'Lead Generation', to: '/services' },
    { label: 'Analytics', to: '/services' },
  ],
  Company: [
    { label: 'Case Studies', to: '/case-studies' },
    { label: 'Process', to: '/process' },
    { label: 'Packages', to: '/packages' },
    { label: 'Book a Call', to: '/book' },
    { label: 'Contact', to: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms-of-service' },
    { label: 'Cookie Policy', to: '/cookie-policy' },
  ],
}

export default function Footer() {
  return (
    <footer
      className="border-t pt-16 pb-8"
      style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="mb-4 inline-block" style={{ textDecoration: 'none' }}>
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-5">
              Practical AI, CRM, and automation systems for SMBs that need more leads, faster
              follow-up, and cleaner operations.
            </p>
            {/* LinkedIn only */}
            <a
              href="https://www.linkedin.com/company/stragyx"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Stragyx on LinkedIn"
              className="w-9 h-9 rounded-lg inline-flex items-center justify-center transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#6b7280',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59,130,246,0.12)'
                e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)'
                e.currentTarget.style.color = '#60a5fa'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.color = '#6b7280'
              }}
            >
              <LinkedInIcon />
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-150"
                      style={{ textDecoration: 'none' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Stragyx. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {[
              { label: 'Privacy Policy', to: '/privacy-policy' },
              { label: 'Terms of Service', to: '/terms-of-service' },
              { label: 'Cookie Policy', to: '/cookie-policy' },
            ].map((link, i, arr) => (
              <span key={link.label} className="flex items-center gap-4">
                <Link
                  to={link.to}
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-150"
                  style={{ textDecoration: 'none' }}
                >
                  {link.label}
                </Link>
                {i < arr.length - 1 && (
                  <span className="text-gray-800 select-none">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
