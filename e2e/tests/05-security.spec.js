import { test, expect } from '@playwright/test'

const CLIENT_EMAIL = 'portal@apextalent.co.uk'
const CLIENT_PASS  = 'Demo1234!'

test.describe('Security & access control', () => {
  test('Unauthenticated user cannot access portal pages', async ({ page: p }) => {
    const protectedPaths = [
      '/portal',
      '/portal/marketing',
      '/portal/pipeline',
      '/portal/website',
      '/portal/tickets',
      '/portal/reports',
      '/portal/settings',
    ]
    for (const path of protectedPaths) {
      await p.goto(path, { waitUntil: 'networkidle' })
      const url = p.url()
      expect(url, `${path} accessible without auth`).toContain('/portal/login')
    }
  })

  test('Unauthenticated user cannot access admin pages', async ({ page: p }) => {
    const adminPaths = [
      '/portal/admin',
      '/portal/admin/tickets',
      '/portal/admin/enquiries',
      '/portal/admin/clients',
    ]
    for (const path of adminPaths) {
      await p.goto(path, { waitUntil: 'networkidle' })
      const url = p.url()
      expect(url, `${path} accessible without auth`).toContain('/portal/login')
    }
  })

  test('Client cannot access admin routes after login', async ({ page: p }) => {
    // Login as client
    await p.goto('/portal/login', { waitUntil: 'networkidle' })
    await p.fill('input[type="email"]', CLIENT_EMAIL)
    await p.fill('input[type="password"]', CLIENT_PASS)
    await p.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
    await p.waitForURL(/\/portal(?!\/login)/, { timeout: 10000 })

    // Try admin routes
    const adminPaths = [
      '/portal/admin',
      '/portal/admin/tickets',
      '/portal/admin/clients',
    ]
    for (const path of adminPaths) {
      await p.goto(path, { waitUntil: 'networkidle' })
      await p.waitForTimeout(1000)
      const body = await p.textContent('body')
      // Should not see admin-specific actions like "Add Client" or all ticket management
      const hasAdminActions = body.includes('Add Client') ||
        (body.includes('All Tickets') && body.includes('Enquiries'))
      expect(hasAdminActions, `Client can access admin content at ${path}`).toBe(false)
    }
  })

  test('API create-client requires service role — no unauthenticated creation', async ({ page: p, request }) => {
    // Try calling the create-client API without admin credentials
    const res = await request.post('https://growthops-portal-roan.vercel.app/api/create-client', {
      data: { email: 'hacker@test.com', password: 'Password123!', business_name: 'Hack Corp' }
    })
    // Should fail — missing or invalid service role key check on adminUserId
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })

  test('API ticket-reply rejects non-admin sender', async ({ request }) => {
    const res = await request.post('https://growthops-portal-roan.vercel.app/api/ticket-reply', {
      data: { ticketId: '00000000-0000-0000-0000-000000000000', message: 'hack', adminUserId: '00000000-0000-0000-0000-000000000000' }
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })
})
