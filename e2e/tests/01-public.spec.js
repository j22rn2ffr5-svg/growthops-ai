import { test, expect } from '@playwright/test'

const PUBLIC_PAGES = [
  { path: '/',               title: /growthops/i },
  { path: '/services',       title: /service/i   },
  { path: '/case-studies',   title: /case/i      },
  { path: '/process',        title: /process/i   },
  { path: '/packages',       title: /package/i   },
  { path: '/contact',        title: /contact/i   },
  { path: '/privacy-policy', title: /privacy/i   },
  { path: '/terms-of-service', title: /terms/i   },
  { path: '/cookie-policy',  title: /cookie/i    },
]

test.describe('Public pages', () => {
  for (const page of PUBLIC_PAGES) {
    test(`${page.path} loads without errors`, async ({ page: p, context }) => {
      const errors = []
      const failed = []
      p.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
      p.on('requestfailed', req => failed.push(`${req.url()} — ${req.failure()?.errorText}`))

      const res = await p.goto(page.path, { waitUntil: 'networkidle' })
      expect(res.status(), `${page.path} returned non-200`).toBeLessThan(400)

      // No JS errors
      const jsErrors = errors.filter(e => !e.includes('favicon') && !e.includes('gtag'))
      expect(jsErrors, `JS errors on ${page.path}: ${jsErrors.join(', ')}`).toHaveLength(0)

      // No failed requests (ignoring analytics)
      const hardFails = failed.filter(f => !f.includes('analytics') && !f.includes('gtag') && !f.includes('hotjar'))
      expect(hardFails, `Failed requests on ${page.path}: ${hardFails.join(', ')}`).toHaveLength(0)
    })
  }

  test('404 page renders for unknown route', async ({ page: p }) => {
    const res = await p.goto('/this-page-does-not-exist', { waitUntil: 'networkidle' })
    const body = await p.textContent('body')
    expect(body).toMatch(/not found|404/i)
  })

  test('Navbar renders on homepage', async ({ page: p }) => {
    await p.goto('/', { waitUntil: 'networkidle' })
    const nav = p.locator('nav').first()
    await expect(nav).toBeVisible()
  })

  test('Homepage has at least one CTA button', async ({ page: p }) => {
    await p.goto('/', { waitUntil: 'networkidle' })
    const btns = await p.locator('a, button').filter({ hasText: /get started|book|contact|learn more/i }).count()
    expect(btns).toBeGreaterThan(0)
  })

  test('Contact form renders required fields', async ({ page: p }) => {
    await p.goto('/contact', { waitUntil: 'networkidle' })
    const body = await p.textContent('body')
    expect(body).toMatch(/name|email/i)
  })

  test('Portal login redirected from /portal without auth', async ({ page: p }) => {
    const res = await p.goto('/portal', { waitUntil: 'networkidle' })
    const url = p.url()
    expect(url).toContain('/portal/login')
  })

  test('Admin page redirected from /portal/admin without auth', async ({ page: p }) => {
    await p.goto('/portal/admin', { waitUntil: 'networkidle' })
    const url = p.url()
    expect(url).toContain('/portal/login')
  })
})
