import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, Users, Zap } from 'lucide-react'
import { Search, Layout, Settings, Bot, Rocket, BarChart3 } from 'lucide-react'
import PageHero from '../components/PageHero'
import CTA from '../components/CTA'
import SEO from '../components/SEO'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Audit & Strategy',
    duration: 'Week 1',
    color: '#60a5fa',
    summary: 'We start by understanding exactly where you are and where you want to go.',
    description:
      'Before we build anything, we review your current website, analytics, CRM setup, marketing channels, and sales process. This gives us a clear picture of what\'s working, what\'s broken, and where the biggest opportunities are. The output is a prioritised growth strategy that becomes the blueprint for everything we build.',
    deliverables: [
      'Website and conversion audit',
      'Analytics and tracking review',
      'CRM and automation assessment',
      'Marketing channel performance review',
      'Competitor positioning analysis',
      'Prioritised growth strategy document',
    ],
    callout: 'Most businesses discover 3–5 significant revenue leaks in this phase alone.',
  },
  {
    number: '02',
    icon: Layout,
    title: 'Website & Funnel Build',
    duration: 'Weeks 2–4',
    color: '#a78bfa',
    summary: 'A conversion-focused website or landing page built to reflect your brand and turn visitors into leads.',
    description:
      'Using the strategy as a guide, we design and build your new website or funnel. Every page is structured around a clear user journey — from first impression to enquiry. We prioritise mobile performance, load speed, and on-page SEO from day one, so the site works hard from the moment it goes live.',
    deliverables: [
      'Wireframes and design approval',
      'Full website build and development',
      'Mobile-optimised, fast-loading build',
      'On-page SEO setup',
      'Lead capture forms and integrations',
      'Content upload and QA',
    ],
    callout: 'You review and approve at every stage. Nothing goes live without your sign-off.',
  },
  {
    number: '03',
    icon: Settings,
    title: 'CRM & Automation Setup',
    duration: 'Weeks 3–5',
    color: '#34d399',
    summary: 'Connect your systems and build the automations that eliminate manual work.',
    description:
      'We configure your CRM pipeline to match your actual sales process, connect your website, forms, and lead sources, and build the automation workflows that handle follow-up, notifications, and data routing automatically. Most clients see immediate time savings — typically 10–20 hours per week — within the first few weeks.',
    deliverables: [
      'CRM configuration and pipeline setup',
      'Lead source integrations',
      'Automated follow-up sequences (email and SMS)',
      'Internal notification workflows',
      'Team access and permissions setup',
      'Training session for your team',
    ],
    callout: 'Automations are tested end-to-end before going live — no surprises.',
  },
  {
    number: '04',
    icon: Bot,
    title: 'AI & Lead Capture Integration',
    duration: 'Week 4–5',
    color: '#f59e0b',
    summary: 'Intelligent lead capture tools that engage visitors and qualify enquiries immediately.',
    description:
      'We deploy AI chatbots trained on your services, pricing, and FAQs — so potential customers get an immediate response at any hour. Lead capture tools are embedded across your website and connected directly to your CRM, ensuring every conversation and enquiry is logged, tracked, and followed up automatically.',
    deliverables: [
      'AI chatbot trained on your business',
      'Chatbot deployed across key pages',
      'Lead qualification logic and routing',
      'CRM integration for all chatbot leads',
      'Out-of-hours enquiry handling',
      'Chatbot performance reporting',
    ],
    callout: 'Businesses using AI chatbots typically see a 30–40% reduction in missed out-of-hours enquiries.',
  },
  {
    number: '05',
    icon: Rocket,
    title: 'Marketing & Content Launch',
    duration: 'Week 5–6',
    color: '#fb923c',
    summary: 'Your SEO strategy, content plan, and paid campaigns go live — all connected to your growth system.',
    description:
      'With the foundation in place, we launch your marketing activity. SEO content goes live and begins building organic authority. Paid campaigns go live with full conversion tracking. Each channel feeds directly into your CRM pipeline, so every lead is captured, attributed, and followed up — automatically.',
    deliverables: [
      'SEO content published and indexed',
      'Paid campaigns live with conversion tracking',
      'LinkedIn outbound campaign (if applicable)',
      'Email nurture sequences active',
      'All channels feeding into CRM',
      'Initial performance baseline report',
    ],
    callout: 'Launch is the start, not the end. Marketing improves every month as data accumulates.',
  },
  {
    number: '06',
    icon: BarChart3,
    title: 'Reporting, Optimisation & Support',
    duration: 'Ongoing',
    color: '#f472b6',
    summary: 'Monthly reviews, continuous improvements, and a system that gets better over time.',
    description:
      'Every month we review performance data, identify what to improve, and implement changes. You get a clear monthly report showing lead volume, conversion rates, cost per acquisition, and pipeline value — along with a prioritised plan for what we\'re working on next. Your growth system compounds over time.',
    deliverables: [
      'Monthly performance report',
      'Lead source and conversion analysis',
      'CRO improvements and testing',
      'SEO progress and ranking updates',
      'Automation and funnel optimisation',
      'Ongoing support and account management',
    ],
    callout: 'Clients on ongoing retainers typically see their best results at months 3–6, as the system matures.',
  },
]

const faqs = [
  {
    q: 'How long does the full build take?',
    a: 'The initial build — website, CRM, automations, and AI tools — typically takes 4–6 weeks depending on complexity. Marketing campaigns begin launching from week 5. Ongoing optimisation and support continues from there.',
  },
  {
    q: 'Do I need to be heavily involved during the build?',
    a: 'We keep it efficient. You\'ll typically need 2–3 hours in the first week for the strategy session and information gathering, then short approval checkpoints at each stage. We handle the rest.',
  },
  {
    q: 'What do you need from us to get started?',
    a: 'Access to your existing accounts (website, analytics, ads), your brand guidelines or preferences, and a clear picture of who your ideal customers are and what you want them to do. We handle the rest.',
  },
  {
    q: 'Can you work with tools we already use?',
    a: 'Yes. We work with most major CRM, email, and ad platforms. If you already have a CRM or website platform you\'re committed to, we\'ll build around it. We\'ll tell you honestly if something won\'t serve you well.',
  },
  {
    q: 'When will we start seeing results?',
    a: 'Quick wins — like faster follow-up and reduced admin — are visible within the first few weeks. Organic and paid marketing typically builds over 2–3 months. Most clients see their strongest results between months 3 and 6.',
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

export default function ProcessPage() {
  return (
    <>
      <SEO
        title="Our Process"
        description="How Stragyx works — from audit and strategy through to build, launch, and ongoing optimisation."
        path="/process"
      />
      <PageHero
        label="How It Works"
        title="A clear, structured path from"
        titleAccent="audit to growth system."
        subtitle="Six stages that take you from where you are now to a fully operational, measurable growth engine."
      />

      {/* Quick stats */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { icon: Clock, value: '4–6 weeks', label: 'To full system launch', color: '#60a5fa' },
            { icon: Users, value: '2–3 hrs', label: 'Your time needed in week 1', color: '#a78bfa' },
            { icon: Zap, value: 'Month 3–6', label: 'When results compound', color: '#34d399' },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.label}
                className="p-5 rounded-2xl text-center"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex justify-center mb-2">
                  <Icon size={20} color={s.color} />
                </div>
                <div className="text-lg font-bold text-white mb-1">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Steps */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 space-y-5">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <FadeUp key={step.number} delay={0.05}>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="grid md:grid-cols-5">
                    {/* Step header — left */}
                    <div
                      className="md:col-span-2 p-8 flex flex-col justify-between"
                      style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${step.color}18` }}
                          >
                            <Icon size={22} color={step.color} />
                          </div>
                          <span
                            className="text-4xl font-black"
                            style={{ color: 'rgba(255,255,255,0.06)', lineHeight: 1 }}
                          >
                            {step.number}
                          </span>
                        </div>
                        <span
                          className="text-xs font-bold uppercase tracking-widest block mb-2"
                          style={{ color: step.color }}
                        >
                          {step.duration}
                        </span>
                        <h2 className="text-xl font-bold text-white mb-3">{step.title}</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">{step.summary}</p>
                      </div>
                      <div
                        className="mt-6 p-3 rounded-xl text-xs text-gray-400 leading-relaxed italic"
                        style={{ background: `${step.color}0d`, borderLeft: `2px solid ${step.color}` }}
                      >
                        {step.callout}
                      </div>
                    </div>

                    {/* Detail + deliverables — right */}
                    <div className="md:col-span-3 p-8">
                      <p className="text-sm text-gray-400 leading-relaxed mb-6">{step.description}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">
                        Deliverables
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {step.deliverables.map((d) => (
                          <div key={d} className="flex items-start gap-2.5">
                            <CheckCircle2 size={13} color={step.color} className="flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-300 leading-snug">{d}</span>
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
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-10">
              Common questions about the process
            </h2>
          </FadeUp>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeUp key={faq.q} delay={i * 0.07}>
                <div
                  className="p-6 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <h3 className="text-base font-bold text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Nudge to contact */}
      <FadeUp>
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div
            className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
              border: '1px solid rgba(96,165,250,0.18)',
            }}
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to start with a strategy session?</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                The audit and strategy stage is where we identify exactly what to build and in what order. Book a call and we'll walk through your business together.
              </p>
            </div>
            <Link to="/book" className="btn-primary text-sm flex-shrink-0" style={{ textDecoration: 'none' }}>
              Book a Strategy Call <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </FadeUp>

      <CTA />
    </>
  )
}
