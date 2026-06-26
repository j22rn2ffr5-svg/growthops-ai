import Hero from '../components/Hero'
import Problem from '../components/Problem'
import Solution from '../components/Solution'
import Services from '../components/Services'
import CaseStudies from '../components/CaseStudies'
import ROI from '../components/ROI'
import Process from '../components/Process'
import Packages from '../components/Packages'
import Founder from '../components/Founder'
import Contact from '../components/Contact'
import CTA from '../components/CTA'
import SEO from '../components/SEO'

export default function HomePage() {
  return (
    <>
      <SEO
        title="AI Growth Systems for SMBs"
        description="Stragyx builds CRM pipelines, automation sequences, and AI tools that keep your business responding fast and converting more — without adding headcount."
        path="/"
      />
      <Hero />
      <Problem />
      <Solution />
      <Services />
      <CaseStudies />
      <ROI />
      <Process />
      <Packages />
      <Founder />
      <Contact />
      <CTA />
    </>
  )
}
