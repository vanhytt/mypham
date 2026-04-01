# Copilot Instructions for Next.js + Supabase Cosmetics App

## Architecture Overview
- **Framework**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL) with two product tables: `"Sản phẩm"` (home products) and `"list"` (catalog products) - handle both schemas in components
- **Data Flow**: Server components fetch data (e.g., product details), client components handle interactivity (filters, animations)
- **Styling**: Tailwind with custom fonts (Inter, Playfair Display) and keyframes (float, fade-in-up, fade-in-left)
- **Components**: Client components for dynamic features, server components for SEO/metadata

## Key Patterns
- **Path Aliases**: Use `@/*` for `src/*` imports (configured in `tsconfig.json`)
- **Product Interfaces**: Support dual schemas - `Name`/`image_url` vs `ten_sp`/`anh_url` (see `ProductDetailClient.tsx`)
- **Animations**: Framer Motion for page transitions, Swiper for image carousels with thumbs
- **Icons**: Lucide React icons (Leaf, Heart, ShieldCheck, etc.)
- **Language**: Vietnamese UI text, but HTML lang="en" (consider fixing)

## Developer Workflows
- **Start Dev**: `npm run dev` (auto-reload on file changes)
- **Build**: `npm run build` (check for TypeScript/ESLint errors)
- **Lint**: `npm run lint` (Next.js ESLint config)
- **Environment**: Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

## Conventions
- **File Structure**: `src/app/` for routes, `src/components/` for reusable components, `src/lib/` for utilities
- **Client Directives**: Use `"use client"` only when needed (state, effects, event handlers)
- **Imports**: Group external libs, then internal components/utilities
- **Error Handling**: Check Supabase responses, show loading states with `Loader2` icon
- **SEO**: Generate metadata in server components (see `san-pham/[id]/page.tsx`)

## Examples
- **Fetch Products**: `const { data } = await supabase.from("Sản phẩm").select("*")`
- **Animate Elements**: `<motion.div initial={{opacity:0}} animate={{opacity:1}}>`
- **Swiper Setup**: Import modules, use `setThumbsSwiper` for thumbnail sync
- **Responsive Design**: Use Tailwind classes like `md:flex` for mobile-first

## Integration Points
- **Supabase Tables**: Query both `"Sản phẩm"` and `"list"` for products
- **Image Optimization**: Use Next.js `Image` component with `/products/` public folder
- **Fonts**: Access via CSS variables `--font-inter`, `--font-playfair`</content>
<parameter name="filePath">c:\Users\leeva\next14-supabase-app\.github\copilot-instructions.md