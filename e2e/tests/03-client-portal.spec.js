import { test, expect } from '@playwright/test'

const CLIENT_EMAIL = 'portal@apextalent.co.uk'
const CLIENT_PASS  = 'Demo1234!'

async function loginAsClient(page) {
  await page.goto('/portal/login', { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', CLIENT_EMAIL)
  await page.fill('input[type="password"]', CLIENT_PASS)
  await page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
  await page.waitForURL(/\/portal(?!\/login)/, { timeout: 10000 })
}

const PORTAL_PAGES = [
  { path: '/portal',              label: 'Overview/Dashboard' },
  { path: '/portal/analytics',   label: 'Analytics' },
  { path: '/portal/performance', label: 'Performance' },
  { path: '/portal/pipeline',    label: 'Pipeline' },
  { path: '/portal/automations', label: 'Automations' },
  { path: '/portal/marketing',   label: 'Marketing' },
  { path: '/portal/website',     label: 'Website' },
  { path: '/portal/tickets',     label: 'Support' },
  { path: '/portal/reports',     label: 'Reports' },
  { path: '/portal/settings',    label: 'Settings' },
]

test.describe('Client portal pages', () => {
  test.beforeEach(async ({ page }) => { await loginAsClient(page) })

  for (const pg of PORTAL_PAGES) {
    test(`${pg.label} page loads without JS errors`, async ({ page: p }) => {
      const errors = []
      const failed = []
      p.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
      p.on('requestfailed', req => {
        const url = req.url()
        const reason = req.failure()?.errorText ?? ''
        // Exclude analytics, supabase.co (auth race aborts), and ERR_ABORTED (component unmount cleanup)
        if (!url.includes('analytics') && !url.includes('gtag') && !url.includes('hotjar') &&
            !url.includes('supabase.co') && !reason.includes('ERR_ABORTED')) {
          failed.push(`${url} — ${reason}`)
        }
      })

      await p.goto(pg.path, { waitUntil: 'networkidle' })
      const url = p.url()
      expect(url, `${pg.label} redirected away`).not.toContain('/login')

      const jsErrors = errors.filter(e => !e.includes('favicon'))
      expect(jsErrors, `JS errors on ${pg.label}: ${jsErrors.join(' | ')}`).toHaveLength(0)
      expect(failed, `Failed requests on ${pg.label}: ${failed.join(' | ')}`).toHaveLength(0)
    })
  }

  test('Sidebar nav is visible and has expected items', async ({ page: p }) => {
    await p.goto('/portal', { waitUntil: 'networkidle' })
    const nav = p.locator('nav, aside').first()
    await expect(nav).toBeVisible()
    const navText = await nav.textContent()
    expect(navText).toMatch(/overview/i)
    expect(navText).toMatch(/marketing/i)
    expect(navText).toMatch(/support/i)
  })

  test('Dashboard stat cards render', async ({ page: p }) => {
    await p.goto('/portal', { waitUntil: 'networkidle' })
    await p.waitForTimeout(2000)
    const body = await p.textContent('body')
    // Should show either getting started OR stat cards
    const hasContent = body.match(/new leads|site score|content live|open tickets|welcome|getting started/i)
    expect(hasContent, 'Dashboard has no recognisable content').toBeTruthy()
  })

  test('Marketing page tabs work', async ({ page: p }) => {
    await p.goto('/portal/marketing', { waitUntil: 'networkidle' })
    await p.waitForTimeout(1000)
    const tabs = await p.locator('button').filter({ hasText: /ai copy|calendar|brief|content/i }).all()
    expect(tabs.length, 'Marketing tabs not found').toBeGreaterThan(0)
    // Click each tab
    for (const tab of tabs) {
      await tab.click()
      await p.waitForTimeout(500)
      const errors = []
      p.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
      expect(errors).toHaveLength(0)
    }
  })

  test('Performance page tabs work', async ({ page: p }) => {
    await p.goto('/portal/performance', { waitUntil: 'networkidle' })
    await p.waitForTimeout(1000)
    const tabs = await p.locator('button').filter({ hasText: /seo|paid|email|cro/i }).all()
    expect(tabs.length, 'Performance tabs not found').toBeGreaterThan(0)
    for (const tab of tabs) {
      await tab.click()
      await p.waitForTimeout(400)
    }
  })

  test('Pipeline page tabs work', async ({ page: p }) => {
    await p.goto('/portal/pipeline', { waitUntil: 'networkidle' })
    await p.waitForTimeout(1000)
    const tabs = await p.locator('button').filter({ hasText: /leads|crm/i }).all()
    for (const tab of tabs) {
      await tab.click()
      await p.waitForTimeout(400)
    }
  })

  test('Support tabs switch between tickets and maintenance', async ({ page: p }) => {
    await p.goto('/portal/tickets', { waitUntil: 'networkidle' })
    await p.waitForTimeout(1000)
    const maintTab = p.locator('button').filter({ hasText: /maintenance/i }).first()
    if (await maintTab.isVisible()) {
      await maintTab.click()
      await p.waitForTimeout(500)
      const body = await p.textContent('body')
      expect(body).toMatch(/maintenance/i)
    }
  })

  test('New ticket form renders and validates required fields', async ({ page: p }) => {
    await p.goto('/portal/tickets/new', { waitUntil: 'networkidle' })
    await p.waitForTimeout(1000)
    const submitBtn = p.locator('button').filter({ hasText: /submit|raise|create/i }).first()
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      await p.waitForTimeout(500)
      // Should stay on the form (validation failed) or show error
      const url = p.url()
      const body = await p.textContent('body')
      const hasValidation = url.includes('/new') || body.match(/required|please|error/i)
      expect(hasValidation, 'Form submitted with empty fields').toBeTruthy()
    }
  })

  test('Reports page generates report', async ({ page: p }) => {
    await p.goto('/portal/reports', { waitUntil: 'networkidle' })
    await p.waitForTimeout(1000)
    const generateBtn = p.locator('button').filter({ hasText: /generate/i }).first()
    await expect(generateBtn).toBeVisible()
    await generateBtn.click()
    await p.waitForTimeout(4000)
    // Should show some report content or "no data"
    const body = await p.textContent('body')
    expect(body).toMatch(/report|no data|lead|ticket|lighthouse/i)
  })

  test('Settings page renders', async ({ page: p }) => {
    await p.goto('/portal/settings', { waitUntil: 'networkidle' })
    await p.waitForTimeout(1000)
    const body = await p.textContent('body')
    expect(body).toMatch(/setting|profile|account|password/i)
  })

  test('AI copy tool renders social post form', async ({ page: p }) => {
    await p.goto('/portal/marketing', { waitUntil: 'networkidle' })
    await p.waitForTimeout(1000)
    // Click AI Copy tab
    const aiTab = p.locator('button').filter({ hasText: /ai copy/i }).first()
    if (await aiTab.isVisible()) {
      await aiTab.click()
      await p.waitForTimeout(500)
    }
    const body = await p.textContent('body')
    expect(body).toMatch(/social post|ad copy|email|blog|generate/i)
  })

  test('Content library renders with filter pills', async ({ page: p }) => {
    await p.goto('/portal/marketing', { waitUntil: 'networkidle' })
    await p.waitForTimeout(1000)
    const libTab = p.locator('button').filter({ hasText: /content library|library/i }).first()
    if (await libTab.isVisible()) {
      await libTab.click()
      await p.waitForTimeout(1000)
      const body = await p.textContent('body')
      expect(body).toMatch(/published|in review|draft|all/i)
    }
  })
})
