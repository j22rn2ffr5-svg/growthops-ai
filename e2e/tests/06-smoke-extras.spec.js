import { test, expect } from '@playwright/test'

const CLIENT_EMAIL = 'portal@apextalent.co.uk'
const CLIENT_PASS  = 'Demo1234!'
const ADMIN_EMAIL  = 'chriseyres@email.com'
const ADMIN_PASS   = 'Warrington20710!'

async function loginAsClient(page) {
  await page.goto('/portal/login', { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', CLIENT_EMAIL)
  await page.fill('input[type="password"]', CLIENT_PASS)
  await page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
  await page.waitForURL(/\/portal(?!\/login)/, { timeout: 10000 })
}

test.describe('Contact form', () => {
  test('Contact form submits and shows confirmation', async ({ page: p }) => {
    await p.goto('/contact', { waitUntil: 'networkidle' })
    await p.locator('input[type="text"]').first().fill('Test User')
    await p.locator('input[type="email"]').fill('smoke@test.example.com')
    await p.locator('textarea').fill('This is an automated smoke test message — safe to ignore.')
    await p.click('button[type="submit"]')
    await p.waitForTimeout(500)
    const body = await p.textContent('body')
    expect(body).toMatch(/enquiry received|thank you/i)
  })
})

test.describe('Ticket submission', () => {
  test.beforeEach(async ({ page }) => { await loginAsClient(page) })

  test('New ticket submits successfully and shows confirmation', async ({ page: p }) => {
    await p.goto('/portal/tickets/new', { waitUntil: 'networkidle' })
    await p.waitForTimeout(500)
    await p.locator('input[type="text"]').fill('[Smoke Test] Auto-generated — safe to delete')
    await p.locator('button').filter({ hasText: /general query/i }).first().click()
    await p.locator('textarea').fill('Created by the automated smoke test suite. Safe to delete from the admin panel.')
    await p.locator('button[type="submit"]').click()
    await p.waitForTimeout(2000)
    const body = await p.textContent('body')
    expect(body).toMatch(/ticket submitted/i)
  })
})

test.describe('Session persistence', () => {
  test('Client session survives page refresh', async ({ page: p }) => {
    await loginAsClient(p)
    await p.reload({ waitUntil: 'networkidle' })
    await p.waitForTimeout(1500)
    const url = p.url()
    expect(url, 'Client was signed out on refresh').not.toContain('/login')
    expect(url).toContain('/portal')
  })

  test('Admin session survives page refresh', async ({ page: p }) => {
    await p.goto('/portal/login', { waitUntil: 'networkidle' })
    await p.fill('input[type="email"]', ADMIN_EMAIL)
    await p.fill('input[type="password"]', ADMIN_PASS)
    await p.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
    await p.waitForURL(/\/portal(?!\/login)/, { timeout: 25000 })
    await p.reload({ waitUntil: 'networkidle' })
    await p.waitForTimeout(1500)
    const url = p.url()
    expect(url, 'Admin was signed out on refresh').not.toContain('/login')
    expect(url).toContain('/portal')
  })
})

test.describe('Portal routing', () => {
  test.beforeEach(async ({ page }) => { await loginAsClient(page) })

  test('Unknown portal route redirects to dashboard without crashing', async ({ page: p }) => {
    await p.goto('/portal/nonexistent-page', { waitUntil: 'networkidle' })
    await p.waitForTimeout(500)
    const url = p.url()
    expect(url, 'Unexpected URL after bad portal route').toMatch(/\/portal($|\/)/)
    expect(url).not.toContain('nonexistent')
    const body = await p.textContent('body')
    expect(body.length, 'Page body is empty — likely a crash').toBeGreaterThan(100)
  })
})
