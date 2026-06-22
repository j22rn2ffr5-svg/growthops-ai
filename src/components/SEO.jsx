import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Stragyx'
const DOMAIN = 'https://stragyx.com'
const DEFAULT_DESC =
  'Practical AI, CRM, and automation systems for SMBs that need more leads, faster follow-up, and cleaner operations.'

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  name: 'Stragyx',
  url: DOMAIN,
  logo: `${DOMAIN}/favicon.svg`,
  description: DEFAULT_DESC,
  areaServed: 'GB',
  sameAs: ['https://www.linkedin.com/company/stragyx'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
}

export default function SEO({ title, description, path = '', faqItems = null }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — AI Growth Systems for SMBs`
  const metaDesc = description || DEFAULT_DESC
  const url = `${DOMAIN}${path}`

  const faqSchema = faqItems
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <link rel="canonical" href={url} />
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  )
}
