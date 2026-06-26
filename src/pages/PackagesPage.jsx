import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, ArrowRight, Zap, HelpCircle,
  RefreshCw, BarChart3, Shield, Users, MessageSquare, TrendingUp, Mic, Tag,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import CTA from '../components/CTA'
import SEO from '../components/SEO'

const packages = [
  {
    name: 'Launch',
    tagline: 'A fast, professional online presence to start generating leads.',
    price: 'Typical investment from £300',
    priceNote: 'One-off project — scoped to your requirements',
    color: '#60a5fa',
    borderColor: 'rgba(96,165,250,0.2)',
    bgColor: 'rgba(59,130,246,0.05)',
    featured: false,
    ideal: 'For founders and early-stage businesses that need a professional online presence quickly. Starting price reflects a basic AI-assisted build — final investment is scoped during requirements gathering based on what you actually need.',
    includes: [
      'AI-assisted website build',
      'Mobile-first, fast-loading design',
      'Basic contact and lead capture form',
      '1 month of support during setup',
      'Full handover on completion',
      'Price scoped to your requirements',
    ],
  },
  {
    name: 'Foundations',
    tagline: 'A proper multi-page website with the systems to back it up.',
    price: 'Typical investment from £1,200',
    priceNote: 'One-off project',
    color: '#c084fc',
    borderColor: 'rgba(192,132,252,0.2)',
    bgColor: 'rgba(168,85,247,0.05)',
    featured: false,
    ideal: 'For businesses that need more than a landing page — a fully structured website with clear service pages, a connected CRM, and automated follow-up built in from day one.',
    includes: [
      'Custom multi-page website (up to 6 pages)',
      'CRM setup and lead pipeline configuration',
      'Lead capture forms and integrations',
      'Automated email follow-up sequence',
      'Basic on-page SEO setup',
      'Analytics and conversion tracking setup',
      'Monthly performance report',
      'Initial strategy and audit session',
    ],
  },
  {
    name: 'Growth System',
    tagline: 'A complete system to generate, nurture, and convert more leads.',
    price: 'Typical investment from £2,500',
    priceNote: 'One-off project',
    color: '#a78bfa',
    borderColor: 'rgba(167,139,250,0.3)',
    bgColor: 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(139,92,246,0.07) 100%)',
    featured: true,
    ideal: 'Best for businesses ready to build a proper growth engine — combining a custom website, AI chatbot, automated follow-up, SEO foundations, and live reporting into one connected system.',
    includes: [
      'Custom multi-page website design and development',
      'Full CRM pipeline setup and deal tracking',
      'AI chatbot trained on your business',
      'Email and SMS follow-up automation',
      'SEO strategy and content foundations',
      'Live reporting dashboard',
      'Monthly strategy review call',
      'Onboarding and team training',
      'Priority support',
    ],
  },
  {
    name: 'Scale',
    tagline: 'Your entire growth function, managed and scaled.',
    price: 'Custom quote',
    priceNote: 'Scoped to your requirements',
    color: '#34d399',
    borderColor: 'rgba(52,211,153,0.2)',
    bgColor: 'rgba(52,211,153,0.04)',
    featured: false,
    ideal: 'Best for businesses ready to invest seriously in growth — with paid advertising, advanced automation, and a dedicated team managing every channel end to end.',
    includes: [
      'Everything in Growth System',
      'Paid advertising management (Google and Meta)',
      'Advanced multi-step automation workflows',
      'Conversion rate optimisation programme',
      'Full analytics and attribution dashboard',
      'LinkedIn lead generation (if applicable)',
      'SEO and content production',
      'Dedicated account manager',
      'Weekly check-in calls',
    ],
    premiumFeature: 'AI Voice Agent',
    premiumFeatureNote: 'AI-powered inbound and outbound call handling — qualify leads, answer FAQs, and book appointments automatically over the phone.',
  },
]

const retentionFeatures = [
  {
    icon: BarChart3,
    title: 'Monthly Performance Reviews',
    description: "A structured monthly session covering lead volume, conversion rates, cost per acquisition, and what we're improving next.",
    color: '#60a5fa',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Optimisation',
    description: 'We test, refine, and improve your website, funnels, and automations every month — compounding results over time.',
    color: '#a78bfa',
  },
  {
    icon: RefreshCw,
    title: 'System Maintenance & Updates',
    description: 'Website updates, automation health checks, CRM housekeeping, and platform version management — handled for you.',
    color: '#34d399',
  },
  {
    icon: MessageSquare,
    title: 'Content & Campaign Updates',
    description: 'Fresh content, updated ad creatives, seasonal campaigns, and email sequences kept current and performing.',
    color: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description: 'Direct access to your account team. Issues are dealt with fast — not queued behind new client work.',
    color: '#fb923c',
  },
  {
    icon: Users,
    title: 'Quarterly Strategy Sessions',
    description: 'Every quarter we step back and review the bigger picture — where the business is going and how to adjust the strategy.',
    color: '#f472b6',
  },
]

const retentionTiers = [
  {
    name: 'Essential Retainer',
    description: 'Core ongoing support to keep your systems running and improving.',
    price: 'From £200',
    priceNote: 'per month',
    color: '#60a5fa',
    includes: [
      'Monthly performance report and review call',
      'Website and automation maintenance',
      'CRM and data housekeeping',
      'Minor content and copy updates',
      'Priority email support',
      'Quarterly strategy check-in',
    ],
  },
  {
    name: 'Active Growth Retainer',
    description: 'Continuous optimisation and active marketing management.',
    price: 'From £600',
    priceNote: 'per month',
    color: '#a78bfa',
    featured: true,
    deal: {
      saving: 'Setup cost reduced by 50%',
      note: '50% off your setup cost when you commit to 12 months upfront.',
    },
    includes: [
      'Everything in Essential',
      'Monthly CRO testing and improvements',
      'SEO content production (2–4 pieces/month)',
      'Email and SMS campaign management',
      'Ad campaign monitoring and optimisation',
      'Dedicated account manager',
      'Bi-weekly check-in calls',
    ],
  },
  {
    name: 'Full Partnership Retainer',
    description: 'Your entire growth function, managed and optimised every month.',
    price: 'From £1,500',
    priceNote: 'per month',
    color: '#34d399',
    deal: {
      saving: 'Setup fully waived',
      note: 'Your entire setup fee is waived when you commit to a 12-month Full Partnership.',
    },
    includes: [
      'Everything in Active Growth',
      'Paid advertising management (Google + Meta)',
      'LinkedIn lead generation management',
      'Advanced automation builds and updates',
      'Competitor monitoring and market analysis',
      'Weekly strategy and performance calls',
      'First access to new AI tools and integrations',
    ],
  },
]

const comparison = [
  { feature: 'Website / landing page', launch: 'Landing page', foundations: 'Multi-page site', growth: 'Full custom build', scale: 'Advanced + funnels' },
  { feature: 'CRM setup', launch: '–', foundations: 'Basic pipeline', growth: 'Full pipeline', scale: 'Advanced + segmentation' },
  { feature: 'AI chatbot', launch: '–', foundations: '–', growth: '✓', scale: '✓' },
  { feature: 'Email / SMS automation', launch: '–', foundations: 'Basic', growth: '✓', scale: 'Advanced multi-step' },
  { feature: 'SEO strategy', launch: '–', foundations: 'On-page basics', growth: 'Full strategy', scale: 'Full strategy + content' },
  { feature: 'Paid advertising', launch: '–', foundations: '–', growth: '–', scale: '✓' },
  { feature: 'CRO programme', launch: '–', foundations: '–', growth: '–', scale: '✓' },
  { feature: 'Analytics dashboard', launch: 'Basic', foundations: 'Basic', growth: 'Live dashboard', scale: 'Full attribution' },
  { feature: 'Strategy review', launch: '–', foundations: 'Report only', growth: 'Monthly call', scale: 'Weekly + monthly' },
  { feature: 'Dedicated account manager', launch: '–', foundations: '–', growth: '–', scale: '✓' },
  { feature: 'AI Voice Agent', launch: '–', foundations: '–', growth: '–', scale: '✓' },
]

const faqs = [
  {
    q: 'Are these fixed packages or can they be customised?',
    a: 'These packages are starting points — not rigid boxes. Most clients have specific needs that sit between packages or require adjustments. We always scope a custom solution based on your actual situation.',
  },
  {
    q: 'How is investment calculated?',
    a: 'Every engagement is scoped to your business — size, current setup, industry, and goals all factor in. We discuss investment on your strategy call once we understand exactly what you need, so you always get an accurate number rather than a generic quote.',
  },
  {
    q: 'Is there a minimum commitment period?',
    a: "Initial builds are project-based with a clear scope and timeline. Retainers run monthly with 30 days' notice — or, if you opt into our 12-month commitment deal, your setup costs are reduced or waived entirely in exchange for the longer term.",
  },
  {
    q: 'Can we start smaller and upgrade later?',
    a: "Yes. Many clients start with Launch or Foundations to get the right infrastructure in place, then move to Growth System or Scale when they're ready to invest more. Everything we build is designed to expand.",
  },
  {
    q: 'What is the AI Voice Agent and which package includes it?',
    a: 'The AI Voice Agent handles inbound and outbound calls automatically — qualifying leads, answering common questions, and booking appointments without a human on the line. It\'s available as part of the Scale package and can also be added as a standalone upgrade on other packages.',
  },
  {
    q: 'When do retainers kick in and what notice period applies?',
    a: "Retainers typically start after an initial build project is complete — once the foundations are in place, we move into ongoing management. We work on rolling monthly agreements with 30 days\' notice, so you're never locked in long-term.",
  },
  {
    q: 'What platforms do you work with?',
    a: "We work with most major platforms — including HubSpot, GoHighLevel, Pipedrive, Webflow, WordPress, Shopify, Google Ads, Meta Ads, Mailchimp, ActiveCampaign, and more. We'll recommend the best fit for your needs.",
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

export default function PackagesPage() {
  return (
    <>
      <SEO
        title="Packages & Pricing"
        description="Stragyx growth system packages. Four tailored systems — Launch, Foundations, Growth System, and Scale — each scoped to your business. Book a free strategy call."
        path="/packages"
        faqItems={faqs}
      />

      <PageHero
        label="Packages"
        title="Choose the right system"
        titleAccent="for your stage of growth."
        subtitle="Four starting-point packages, each customised to your business before we quote. No hidden fees, no vague scopes."
      />

      {/* Package cards */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {packages.map((pkg, i) => (
              <FadeUp key={pkg.name} delay={i * 0.07}>
                <div
                  className="rounded-2xl overflow-hidden relative flex flex-col h-full"
                  style={{
                    background: pkg.bgColor,
                    border: `1px solid ${pkg.borderColor}`,
                    ...(pkg.featured ? { boxShadow: '0 0 60px rgba(139,92,246,0.12)' } : {}),
                  }}
                >
                  {pkg.featured && (
                    <div
                      className="flex items-center justify-center gap-2 py-2 text-xs font-bold tracking-widest uppercase"
                      style={{
                        background: 'linear-gradient(90deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
                        borderBottom: `1px solid ${pkg.borderColor}`,
                        color: '#c4b5fd',
                      }}
                    >
                      <Zap size={11} fill="currentColor" />
                      Most Popular
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: pkg.color }}>
                      {pkg.name}
                    </span>
                    <h2 className="text-base font-bold text-white mb-2 leading-snug">{pkg.tagline}</h2>

                    <div className="mb-4">
                      <span className="text-xs text-gray-500 italic">Investment scoped to your requirements</span>
                    </div>

                    <div
                      className="p-3 rounded-xl mb-5"
                      style={{ background: `${pkg.color}0d`, border: `1px solid ${pkg.borderColor}` }}
                    >
                      <p className="text-xs text-gray-400 leading-relaxed">{pkg.ideal}</p>
                    </div>

                    <div className="mb-4 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">What's included</p>
                      <div className="space-y-2">
                        {pkg.includes.map((item) => (
                          <div key={item} className="flex items-start gap-2.5">
                            <CheckCircle2 size={13} color={pkg.color} className="flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-300 leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Voice Agent premium highlight */}
                    {pkg.premiumFeature && (
                      <div
                        className="mb-5 p-3 rounded-xl"
                        style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Mic size={12} color="#34d399" />
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#34d399' }}>
                            Premium Feature
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white mb-1">{pkg.premiumFeature}</p>
                        <p className="text-xs text-gray-400 leading-snug">{pkg.premiumFeatureNote}</p>
                      </div>
                    )}

                    <Link
                      to="/book"
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-200 mt-auto"
                      style={
                        pkg.featured
                          ? {
                              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                              color: 'white',
                              boxShadow: '0 0 24px rgba(59,130,246,0.3)',
                              textDecoration: 'none',
                            }
                          : {
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'white',
                              textDecoration: 'none',
                            }
                      }
                    >
                      Book a Free Strategy Call
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Pricing guidance + trust phrases */}
          <FadeUp delay={0.15}>
            <div
              className="mt-10 rounded-2xl p-7"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  'No pressure, no hard sell.',
                  'Built around your existing tools where possible.',
                  'Clear scope before any work begins.',
                  'Practical implementation, not strategy decks.',
                ].map((phrase) => (
                  <div
                    key={phrase}
                    className="flex items-start gap-2 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}
                  >
                    <span className="text-blue-400 flex-shrink-0 mt-0.5 text-base leading-none">✓</span>
                    <span className="text-xs text-gray-400 leading-snug">{phrase}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Retention Partnership */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="text-center mb-4">
              <span className="section-label">Ongoing Partnership</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-3">
              Built to keep growing — not just launched
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-14 text-sm leading-relaxed">
              Every system we build is backed by an ongoing retainer option. We stay in your corner —
              optimising, maintaining, and expanding what we've built so results compound over time.
            </p>
          </FadeUp>

          {/* What's included in retention */}
          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {retentionFeatures.map((feat, i) => {
              const Icon = feat.icon
              return (
                <FadeUp key={feat.title} delay={i * 0.07}>
                  <div
                    className="p-6 rounded-2xl h-full"
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${feat.color}18`, border: `1px solid ${feat.color}30` }}
                    >
                      <Icon size={18} color={feat.color} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>

          {/* Retention tiers */}
          <FadeUp>
            <h3 className="text-lg font-bold text-white text-center mb-6">Choose your retainer level</h3>
          </FadeUp>

          {/* 12-month deal banner */}
          <FadeUp delay={0.05}>
            <div
              className="mb-8 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.07) 0%, rgba(245,158,11,0.05) 100%)',
                border: '1px solid rgba(251,191,36,0.25)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}
              >
                <Tag size={18} color="#fbbf24" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-1">Commit to growth, save on setup</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Choose a 12-month Active Growth or Full Partnership retainer and we'll reduce or eliminate your setup cost — so more of your budget goes into results from day one.
                  <span className="text-yellow-400 font-semibold"> Active Growth: 50% off setup. Full Partnership: setup fully waived.</span>
                </p>
              </div>
              <Link
                to="/book"
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', textDecoration: 'none' }}
              >
                Claim this deal <ArrowRight size={12} />
              </Link>
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-5">
            {retentionTiers.map((tier, i) => (
              <FadeUp key={tier.name} delay={i * 0.08}>
                <div
                  className="rounded-2xl overflow-hidden flex flex-col h-full"
                  style={{
                    background: tier.featured
                      ? 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(139,92,246,0.07) 100%)'
                      : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${tier.featured ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    ...(tier.featured ? { boxShadow: '0 0 60px rgba(139,92,246,0.1)' } : {}),
                  }}
                >
                  {tier.featured && (
                    <div
                      className="flex items-center justify-center gap-2 py-2 text-xs font-bold tracking-widest uppercase"
                      style={{
                        background: 'linear-gradient(90deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
                        borderBottom: '1px solid rgba(167,139,250,0.3)',
                        color: '#c4b5fd',
                      }}
                    >
                      <Zap size={11} fill="currentColor" />
                      Most Popular
                    </div>
                  )}
                  <div className="p-7 flex flex-col flex-1">
                    <span className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: tier.color }}>
                      {tier.name}
                    </span>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">{tier.description}</p>
                    <div className="mb-5">
                      <span className="text-xs text-gray-500 italic">Investment discussed on your strategy call</span>
                    </div>
                    <div className="space-y-2.5 flex-1 mb-6">
                      {tier.includes.map((item) => (
                        <div key={item} className="flex items-start gap-2.5">
                          <CheckCircle2 size={14} color={tier.color} className="flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300 leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                    {tier.deal && (
                      <div
                        className="mb-4 p-3 rounded-xl"
                        style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.22)' }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Tag size={11} color="#fbbf24" />
                          <span className="text-xs font-bold" style={{ color: '#fbbf24' }}>12-Month Deal</span>
                        </div>
                        <p className="text-xs font-semibold text-white mb-0.5">{tier.deal.saving}</p>
                        <p className="text-xs text-gray-400 leading-snug">{tier.deal.note}</p>
                      </div>
                    )}

                    <Link
                      to="/book"
                      className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-200 mt-auto"
                      style={
                        tier.featured
                          ? {
                              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                              color: 'white',
                              boxShadow: '0 0 24px rgba(59,130,246,0.3)',
                              textDecoration: 'none',
                            }
                          : {
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'white',
                              textDecoration: 'none',
                            }
                      }
                    >
                      Book a Free Strategy Call
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table — mobile scrollable */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-10">
              Feature comparison
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="overflow-x-auto -mx-2 px-2">
              <div
                className="rounded-2xl overflow-hidden min-w-[700px]"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* Table header */}
                <div
                  className="grid grid-cols-5 gap-0"
                  style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="p-4" />
                  {[
                    { label: 'Launch', color: '#60a5fa' },
                    { label: 'Foundations', color: '#c084fc' },
                    { label: 'Growth', color: '#a78bfa' },
                    { label: 'Scale', color: '#34d399' },
                  ].map((h) => (
                    <div key={h.label} className="p-4 text-center">
                      <span className="text-sm font-bold" style={{ color: h.color }}>{h.label}</span>
                    </div>
                  ))}
                </div>
                {/* Rows */}
                {comparison.map((row, i) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-5 gap-0"
                    style={{
                      borderBottom: i < comparison.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                    }}
                  >
                    <div className="p-4 text-sm text-gray-400 flex items-center gap-2">
                      {row.feature === 'AI Voice Agent' && (
                        <Mic size={12} color="#34d399" className="flex-shrink-0" />
                      )}
                      {row.feature}
                    </div>
                    <div className="p-4 flex items-center justify-center">
                      <span className="text-xs text-gray-400 text-center">{row.launch}</span>
                    </div>
                    <div className="p-4 flex items-center justify-center">
                      <span className="text-xs text-gray-400 text-center">{row.foundations}</span>
                    </div>
                    <div className="p-4 flex items-center justify-center">
                      <span className="text-xs text-gray-400 text-center">{row.growth}</span>
                    </div>
                    <div className="p-4 flex items-center justify-center">
                      <span
                        className="text-xs text-center font-medium"
                        style={row.feature === 'AI Voice Agent' && row.scale === '✓' ? { color: '#34d399' } : { color: '#9ca3af' }}
                      >
                        {row.scale}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 md:py-12 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-3">
              Before you reach out
            </h2>
            <p className="text-gray-500 text-sm text-center mb-10">
              Common questions we get asked before people book a call.
            </p>
          </FadeUp>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeUp key={faq.q} delay={i * 0.06}>
                <div
                  className="p-6 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle size={16} color="#60a5fa" className="flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-bold text-white mb-2">{faq.q}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
