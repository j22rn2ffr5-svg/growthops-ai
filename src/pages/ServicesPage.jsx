import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import SEO from '../components/SEO'
import CTA from '../components/CTA'
import {
  Monitor, Bot, Users, Workflow, Search, PenTool,
  Target, Megaphone, Mail, TrendingUp, BarChart3, Wrench,
} from 'lucide-react'

const services = [
  {
    icon: Monitor,
    title: 'Custom Website Design & Development',
    color: '#60a5fa',
    tagline: 'Your website is your hardest-working salesperson.',
    description:
      'We design and build conversion-focused websites that reflect your brand, communicate your value clearly, and turn visitors into enquiries. Every site is built for performance — fast-loading, mobile-first, and structured to rank in search.',
    includes: [
      'Custom design tailored to your brand',
      'Conversion-optimised layouts and copy structure',
      'Mobile-first, responsive build',
      'On-page SEO foundations built in',
      'Fast load speed and Core Web Vitals optimisation',
      'Lead capture forms and CTA placement',
      'Integration with CRM and analytics tools',
    ],
  },
  {
    icon: Bot,
    title: 'AI Chatbot Setup',
    color: '#a78bfa',
    tagline: 'Engage and qualify leads 24 hours a day.',
    description:
      'Our AI chatbots are trained on your business, services, and FAQs — so they handle common enquiries, qualify leads, and route the right conversations to your team automatically. No more missed out-of-hours enquiries.',
    includes: [
      'Custom chatbot trained on your services and FAQs',
      'Lead qualification and routing logic',
      'Appointment booking integration',
      'Handoff to live agent or CRM when needed',
      'Multi-page deployment across your website',
      'Performance reporting on conversations',
    ],
  },
  {
    icon: Users,
    title: 'CRM Setup & Optimisation',
    color: '#34d399',
    tagline: 'A structured pipeline so no lead ever gets lost.',
    description:
      'We configure a CRM system built around your actual sales process — with pipelines, deal stages, task automation, and contact management set up from day one. If you already have a CRM, we optimise it so your team actually uses it.',
    includes: [
      'CRM platform setup and configuration',
      'Custom pipeline stages matching your sales process',
      'Contact and lead segmentation',
      'Automated task creation and reminders',
      'Team onboarding and training',
      'Integration with website, email, and automation tools',
    ],
  },
  {
    icon: Workflow,
    title: 'Business Process Automations',
    color: '#f59e0b',
    tagline: 'Remove repetitive admin from your team\'s day.',
    description:
      'We map your existing processes and build automated workflows that handle follow-ups, data entry, notifications, and task routing without manual effort. Most clients save between 10 and 20 hours per week within the first month.',
    includes: [
      'Process mapping and automation audit',
      'Lead follow-up automation (email and SMS)',
      'Internal notification and task routing',
      'Quote and proposal workflow automation',
      'Data sync between tools and platforms',
      'Automated reporting and alerts',
    ],
  },
  {
    icon: Search,
    title: 'SEO Strategy',
    color: '#60a5fa',
    tagline: 'Rank for the searches that matter to your business.',
    description:
      'Our SEO strategies are built around the keywords your ideal customers are actively searching for — not vanity terms. We focus on content, structure, and authority to drive qualified organic traffic that compounds over time.',
    includes: [
      'Keyword research and opportunity mapping',
      'Technical SEO audit and fixes',
      'On-page optimisation across all key pages',
      'Local SEO setup (Google Business Profile)',
      'Content strategy and topic cluster planning',
      'Monthly ranking reports and progress reviews',
    ],
  },
  {
    icon: PenTool,
    title: 'Content Creation',
    color: '#f472b6',
    tagline: 'Authority content that attracts and converts.',
    description:
      'We produce written content — blog articles, landing pages, case studies, service pages, email sequences — that positions your business as the credible choice in your market. Every piece is written to rank and to convert.',
    includes: [
      'SEO-optimised blog articles',
      'Service and landing page copy',
      'Case studies and client success stories',
      'Email nurture sequences',
      'Social media content strategy',
      'Content calendar and publishing plan',
    ],
  },
  {
    icon: Target,
    title: 'Lead Generation',
    color: '#fb923c',
    tagline: 'A consistent pipeline of qualified opportunities.',
    description:
      'We build multi-channel lead generation systems that fill your pipeline with trackable, qualified leads — combining organic, paid, outbound, and referral channels into a single connected strategy.',
    includes: [
      'Lead generation audit and channel strategy',
      'Landing page and offer creation',
      'LinkedIn outbound and connection campaigns',
      'Lead magnet design and delivery',
      'Lead scoring and qualification setup',
      'Pipeline reporting and conversion tracking',
    ],
  },
  {
    icon: Megaphone,
    title: 'Paid Advertising',
    color: '#a78bfa',
    tagline: 'Every pound of ad spend tracked and accountable.',
    description:
      'We manage Google and Meta campaigns focused on performance — not just impressions. Every campaign is tracked back to real outcomes: leads, bookings, or sales. We optimise continuously and report transparently.',
    includes: [
      'Google Ads (Search, Display, Shopping)',
      'Meta Ads (Facebook and Instagram)',
      'Audience research and targeting strategy',
      'Ad creative and copy',
      'Conversion tracking and pixel setup',
      'Weekly optimisation and monthly performance reports',
    ],
  },
  {
    icon: Mail,
    title: 'Email & SMS Systems',
    color: '#34d399',
    tagline: 'Automated follow-up that runs while you sleep.',
    description:
      'We build automated email and SMS sequences that nurture leads from first enquiry to signed client — and then keep existing customers engaged. Timed, personalised, and triggered by real behaviour in your CRM.',
    includes: [
      'Welcome and onboarding sequences',
      'Lead nurture email campaigns',
      'SMS follow-up for enquiries and appointments',
      'Re-engagement campaigns for cold leads',
      'Post-sale and review request sequences',
      'Open rate and conversion reporting',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Conversion Rate Optimisation',
    color: '#f59e0b',
    tagline: 'Get more from the traffic you already have.',
    description:
      'CRO is about making your existing website and funnels work harder. We analyse user behaviour, test changes systematically, and implement improvements that increase the percentage of visitors who take action.',
    includes: [
      'Heatmap and session recording analysis',
      'Conversion audit of key pages and funnels',
      'A/B testing of headlines, CTAs, and layouts',
      'Form optimisation and friction reduction',
      'Page speed and UX improvements',
      'Monthly CRO reporting and roadmap',
    ],
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting Dashboards',
    color: '#60a5fa',
    tagline: 'See exactly what\'s working and where to invest next.',
    description:
      'We build live reporting dashboards that give you a clear, single view of your marketing and sales performance — lead sources, conversion rates, cost per acquisition, and revenue attribution — all in one place.',
    includes: [
      'GA4 setup and configuration',
      'Custom dashboard build (Looker Studio / equivalent)',
      'Lead source and conversion tracking',
      'CRM and ad platform data integration',
      'Monthly performance review reports',
      'KPI goal tracking and alerting',
    ],
  },
  {
    icon: Wrench,
    title: 'Maintenance & Support',
    color: '#94a3b8',
    tagline: 'Keep your systems fast, secure, and running.',
    description:
      'Ongoing technical maintenance ensures your website, integrations, and automations stay up to date, secure, and performing. We handle updates, monitoring, and troubleshooting so you don\'t have to.',
    includes: [
      'Monthly website updates and security patches',
      'Plugin and platform version management',
      'Uptime monitoring and alert response',
      'Automation health checks',
      'Minor content and copy updates',
      'Priority support for critical issues',
    ],
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
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function ServicesPage() {
  return (
    <>
      <SEO
        title="Services"
        description="AI chatbots, CRM setup, automation workflows, website design, SEO strategy, paid advertising, and analytics — all built for SMBs."
        path="/services"
      />
      <PageHero
        label="Services"
        title="Everything you need to"
        titleAccent="grow, automate, and scale."
        subtitle="Twelve integrated services — each one designed to work as part of your wider growth system, not in isolation."
      />

      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <FadeUp key={s.title} delay={0.05 * (i % 4)}>
                <div
                  className="rounded-2xl p-8 md:p-10"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="grid md:grid-cols-5 gap-8">
                    {/* Left: icon + title */}
                    <div className="md:col-span-2">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: `${s.color}18` }}
                      >
                        <Icon size={24} color={s.color} />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2 leading-snug">{s.title}</h2>
                      <p className="text-sm font-medium mb-4" style={{ color: s.color }}>{s.tagline}</p>
                      <p className="text-sm text-gray-400 leading-relaxed">{s.description}</p>
                    </div>
                    {/* Right: what's included */}
                    <div className="md:col-span-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">What's included</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {s.includes.map((item) => (
                          <div key={item} className="flex items-start gap-3">
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                              style={{ background: s.color }}
                            />
                            <span className="text-sm text-gray-300 leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            )
          })}
        </div>

        {/* Packages nudge */}
        <FadeUp delay={0.1}>
          <div className="max-w-7xl mx-auto px-6 mt-10">
            <div
              className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
                border: '1px solid rgba(96,165,250,0.18)',
              }}
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Not sure which services you need?</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                  Our packages bundle the most common combinations. Book a free strategy call and we'll identify exactly what will move the needle for your business.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Link to="/packages" className="btn-secondary text-sm" style={{ textDecoration: 'none' }}>
                  View Packages
                </Link>
                <Link to="/book" className="btn-primary text-sm" style={{ textDecoration: 'none' }}>
                  Book a Call <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      <CTA />
    </>
  )
}
