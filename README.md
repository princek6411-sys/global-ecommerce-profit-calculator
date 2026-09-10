# Global E-commerce True Profit Calculator

Vercel-ready Next.js MVP for a global e-commerce profit decision tool.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload this folder to the repository.
3. Import the repository in Vercel.
4. Use the detected Next.js settings.
5. Deploy.
6. Add your custom domain in Vercel.
7. Replace `https://example.com` in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts` with your real domain.

## Important before production

The platform fee values in `lib/config.ts` are deliberately labeled demo assumptions. Verify current official platform fee schedules, payment fees, taxes and seller-specific terms before publishing them as factual current data.

The MVP's feedback, roadmap votes and share links are client-side. For real multi-user persistence, connect Supabase/Postgres (or another database) and server-side APIs.
