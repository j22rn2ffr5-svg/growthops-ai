import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replace(/\\/g, '/')
          if (norm.includes('node_modules/framer-motion')) return 'vendor-motion'
          if (norm.includes('node_modules/react-dom') || norm.includes('node_modules/react/') || norm.includes('node_modules/react-router')) return 'vendor-react'
          if (norm.includes('node_modules/lucide-react') || norm.includes('node_modules/react-helmet-async')) return 'vendor-ui'
          if (norm.includes('node_modules/@supabase') || norm.includes('node_modules/supabase-js')) return 'vendor-supabase'
          if (norm.includes('/pages/portal/admin/')) return 'portal-admin'
          if (norm.includes('/pages/portal/')) return 'portal'
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
