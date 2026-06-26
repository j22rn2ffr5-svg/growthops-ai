import PageHero from '../components/PageHero'
import SEO from '../components/SEO'
import LegalReviewNotice from '../components/LegalReviewNotice'

const cookieTypes = [
  {
    name: 'Essential cookies',
    purpose: 'These cookies are required for the website to function correctly. They cannot be disabled.',
    examples: 'Session management, security tokens, cookie consent preference',
    canDisable: false,
  },
  {
    name: 'Analytics cookies',
    purpose: 'These cookies help us understand how visitors interact with our website — which pages are visited most, where people come from, and how they navigate the site.',
    examples: 'Page view tracking, session duration, traffic source analysis',
    canDisable: true,
  },
]

export default function CookiePolicyPage() {
  return (
    <>
      <SEO
        title="Cookie Policy"
        description="Information about the cookies used on the Stragyx website."
        path="/cookie-policy"
      />
      <PageHero
        label="Legal"
        title="Cookie Policy"
        titleAccent=""
        subtitle="Last updated: May 2025"
      />
      <LegalReviewNotice />

      <section className="pb-24 md:pb-32 pt-10">
        <div className="max-w-3xl mx-auto px-6 space-y-10">

          <div
            className="p-8 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p className="text-sm text-gray-400 leading-relaxed">
              This Cookie Policy explains what cookies are, how Stragyx uses them, and your
              choices about their use. We keep things simple — we only use cookies that are
              necessary or that you have explicitly consented to.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-4">What are cookies?</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They
              allow the website to remember your preferences or collect information about how
              you use the site. Cookies cannot access other data on your device or run programs.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-6">Cookies we use</h2>
            <div className="space-y-5">
              {cookieTypes.map((type) => (
                <div
                  key={type.name}
                  className="p-6 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-sm font-bold text-white">{type.name}</h3>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={
                        type.canDisable
                          ? { background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }
                          : { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }
                      }
                    >
                      {type.canDisable ? 'Optional' : 'Required'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">{type.purpose}</p>
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-400">Examples: </span>
                    {type.examples}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-4">Your choices</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              When you first visit our site, we ask for your consent to use optional analytics
              cookies via a banner at the bottom of the page. You can:
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong className="text-gray-300">Accept</strong> — essential and analytics cookies will be active</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong className="text-gray-300">Decline</strong> — only essential cookies will be active</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong className="text-gray-300">Browser settings</strong> — you can block or delete cookies at any time through your browser settings. Note: blocking essential cookies may affect site functionality.</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-4">Third-party cookies</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              If you book a call via Calendly, or visit links to third-party platforms from our
              site, those services may set their own cookies subject to their own privacy and cookie
              policies. We are not responsible for third-party cookies.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-4">Contact</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Questions about this policy: hello@stragyx.com
            </p>
          </div>

        </div>
      </section>
    </>
  )
}
