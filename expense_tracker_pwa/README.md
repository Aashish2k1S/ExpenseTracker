# React + Vite PWA Starter Guide

A reference template for setting up a mobile-first Progressive Web App (PWA) using React, Vite, Tailwind CSS v4, Recharts, and Lucide Icons.

## Tech Stack
* **Framework:** React + Vite
* **Styling:** Tailwind CSS (`@tailwindcss/vite`)
* **Icons & Charts:** `lucide-react`, `recharts`
* **PWA:** `vite-plugin-pwa`

---

## 1. Project Setup

Scaffold a new Vite project and install the required dependencies:

```bash
# 1. Create Vite project (select React + JavaScript/TypeScript)
npm create vite@latest my-pwa-app
cd my-pwa-app

# 2. Install core dependencies
npm install lucide-react recharts tailwindcss @tailwindcss/vite

# 3. Install PWA plugin
npm install -D vite-plugin-pwa

```

Add Tailwind CSS to your main CSS file (e.g., `src/index.css`):

```css
@import "tailwindcss";

```

---

## 2. Generate PWA Icons & Assets

Generate the required icons (`favicon.ico`, `apple-touch-icon.png`, `pwa-192x192.png`, `pwa-512x512.png`) using either:

* **Web tool:** [RealFaviconGenerator](https://realfavicongenerator.net/)
* **CLI tool:** `npx @vite-pwa/assets-generator`

Place all generated icon files directly into the `./public` folder at the root of your project.

---

## 3. Configure `index.html`

Add the following mobile and PWA meta tags inside the `<head>` section of your `index.html`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<meta name="theme-color" content="#0a0a0a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

```

---

## 4. Configure `vite.config.js`

Update `vite.config.js` to register Tailwind CSS, configure the PWA manifest, and allow local network/Cloudflare tunnel access:

```javascript
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// [https://vite.dev/config/](https://vite.dev/config/)
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: "Aashish's Finance Tracker",
        short_name: 'Finances',
        description: 'Daily micro-transaction & goal tracker',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  server: {
    host: true, // Exposes the server to your local network
    port: 5173,
    allowedHosts: ['.trycloudflare.com'], // Allows Cloudflare tunnel URLs
  },
});

```

---

## 5. Testing PWA Locally on Mobile (HTTPS)

Browsers require **HTTPS** to register Service Workers and enable PWA installation. Use a Cloudflare quick tunnel to expose your local dev server over HTTPS:

1. **Terminal 1** — Start the Vite dev server:
```bash
npm run dev

```


2. **Terminal 2** — Start the Cloudflare tunnel:
```bash
npx cloudflared tunnel --url http://localhost:5173

```


3. Copy the generated `https://....trycloudflare.com` URL from the terminal.

---

## 6. Installing the App on Mobile

Open the `https://....trycloudflare.com` (or production) URL on your phone:

* **Android (Chrome):** Tap the **three-dot menu** → **Install app** (or *Add to Home screen*).
* **iOS (Safari):** Tap the **Share** icon → **Add to Home Screen**.

```

```