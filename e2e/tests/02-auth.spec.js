import { test, expect } from '@playwright/test'

const CLIENT_EMAIL = 'portal@apextalent.co.uk'
const CLIENT_PASS  = 'Demo1234!'
const ADMIN_EMAIL  = 'chriseyres@email.com'
const ADMIN_PASS   = 'Warrington20710!'

test.describe('Authentication', () => {
  test('Login page renders', async ({ page: p }) => {
    await p.goto('/portal/login', { waitUntil: 'networkidle' })
    await expect(p.locator('input[type="email"]')).toBeVisible()
    await expect(p.locator('input[type="password"]')).toBeVisible()
    const submitBtn = p.locator('button[type="submit"], button').filter({ hasText: /sign in|log in/i }).first()
    await expect(submitBtn).toBeVisible()
  })

  test('Login fails with wrong credentials', async ({ page: p }) => {
    await p.goto('/portal/login', { waitUntil: 'networkidle' })
    await p.fill('input[type="email"]', 'wrong@example.com')
    await p.fill('input[type="password"]', 'wrongpassword')
    await p.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
    await p.waitForTimeout(2000)
    const url = p.url()
    expect(url).toContain('/portal/login')
    const body = await p.textContent('body')
    expect(body).toMatch(/invalid|incorrect|error|wrong/i)
  })

  test('Client login succeeds and lands on portal dashboard', async ({ page: p }) => {
    await p.goto('/portal/login', { waitUntil: 'networkidle' })
    await p.fill('input[type="email"]', CLIENT_EMAIL)
    await p.fill('input[type="password"]', CLIENT_PASS)
    await p.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
    await p.waitForURL(/\/portal(?!\/login)/, { timeout: 10000 })
    const url = p.url()
    expect(url).not.toContain('/login')
  })

  test('Admin login succeeds', async ({ page: p }) => {
    await p.goto('/portal/login', { waitUntil: 'networkidle' })
    await p.fill('input[type="email"]', ADMIN_EMAIL)
    await p.fill('input[type="password"]', ADMIN_PASS)
    await p.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
    await p.waitForURL(/\/portal(?!\/login)/, { timeout: 25000 })
    const url = p.url()
    expect(url).not.toContain('/login')
  })

  test('Client cannot access admin area', async ({ page: p }) => {
    // Log in as client
    await p.goto('/portal/login', { waitUntil: 'networkidle' })
    await p.fill('input[type="email"]', CLIENT_EMAIL)
    await p.fill('input[type="password"]', CLIENT_PASS)
    await p.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
    await p.waitForURL(/\/portal(?!\/login)/, { timeout: 10000 })

    // Try to navigate to admin
    await p.goto('/portal/admin', { waitUntil: 'networkidle' })
    const url = p.url()
    // Should be redirected away or show no admin content
    const body = await p.textContent('body')
    const hasAdminContent = body.includes('All Tickets') && body.includes('Enquiries') && body.includes('Add Client')
    expect(hasAdminContent, 'Client can see admin content — access control broken').toBe(false)
  })

  test('Sign out works', async ({ page: p }) => {
    await p.goto('/portal/login', { waitUntil: 'networkidle' })
    await p.fill('input[type="email"]', CLIENT_EMAIL)
    await p.fill('input[type="password"]', CLIENT_PASS)
    await p.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
    await p.waitForURL(/\/portal(?!\/login)/, { timeout: 10000 })

    const signOutBtn = p.locator('button').filter({ hasText: /sign out|log out/i }).first()
    await expect(signOutBtn).toBeVisible()
    await signOutBtn.click()
    await p.waitForURL(/\/portal\/login/, { timeout: 10000 })
    expect(p.url()).toContain('/portal/login')
  })
})
