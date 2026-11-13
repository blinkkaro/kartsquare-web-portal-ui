# 03 · Design system

The source of truth is **code**: `constants/colors.ts` (palette), `utils/theme.ts` (MUI theme and typography), `app/layout.tsx` (fonts), `app/globals.css` (CSS variables). This page explains it. If they disagree, the code wins and this page is wrong: fix it.

The site is **light-only** (`features/ui/uiSlice.ts` forces `mode: "light"`). Dark tokens exist in `colors.ts` but are unused.

## Colours

Always import from `COLORS` (`@/constants/colors`) or read the MUI theme (`theme.palette.*`). Never write a hex in a component.

| Role | Token | Value |
| --- | --- | --- |
| **Primary (violet)** | `COLORS.PRIMARY_PURPLE` | `#5e18e9` |
| Primary hover / pressed | `COLORS.PURPLE_HOVER` | `#4b12bb` |
| Primary tints | `PURPLE_ALPHA_04 / 10 / 20 / 30` | `rgba(94,24,233, .04 / .1 / .2 / .3)` |
| Secondary (cyan) | `theme.palette.secondary.main` | `#00B2FF` |
| Accent (warm) | `COLORS.SECONDARY_ORANGE` | `#f97316` |
| Text primary | `COLORS.TEXT.PRIMARY_LIGHT` | `#30263E` |
| Text secondary | `COLORS.TEXT.SECONDARY_LIGHT` | `#5b6170` |
| Page background | `COLORS.BACKGROUND.PRIMARY_LIGHT` | `#ffffff` |
| Services 2.0 page background (warm) | `COLORS.NEW_UI.PAGE_BG_LIGHT` | `#FCFBF9` |
| Surface / paper | `COLORS.BACKGROUND.PAPER_LIGHT` | `#f5f4fa` |
| Soft surface | `COLORS.NEW_UI.SURFACE_SOFT_LIGHT` | `#f8f6fb` |
| Border | `COLORS.BORDER.DEFAULT_LIGHT` / `NEW_UI.CARD_BORDER_LIGHT` | `#e5e7eb` / `#ede9f2` |
| Success | `COLORS.SUCCESS_GREEN` | `#33cf4d` |
| Error | `COLORS.ERROR_RED` | `#ff4d4f` |
| Brand gradient | `COLORS.PURPLECYAN` | `135deg, #c2edff → #eedaff` |

**Category colours** come from the API (`category.color`, `#rrggbb`). Tint tiles with `categoryTint(color)` (15 % alpha) from `components/common/CategoryIcon.tsx`; fall back to `PURPLE_ALPHA_10` when missing.

### Home page stays on the brand palette

**Decision (owner):** the brand is purple (`#5e18e9`) with Plus Jakarta Sans. A black-and-white, system-font look was tried for the customer home page and rejected. Do not re-introduce it; improve the home page within `COLORS`.

### Brand migration: planned, not blocking

**Decision (owner):** keep `#5e18e9`, Plus Jakarta Sans and Mukta for now. The migration to `#561DE2`, `#FAFAF7`, Poppins and Inter is a separate future PR. Do not start it piecemeal inside feature work.

The brand brief asks for violet `#561DE2` and a warm off-white `#FAFAF7` background. The code uses `#5e18e9` and `#ffffff` / `#FCFBF9`. Adopting the brief means changing `COLORS.PRIMARY_PURPLE`, `PURPLE_HOVER`, the `PURPLE_ALPHA_*` rgba values (they hard-code `94,24,233`), `--color-primary` in `globals.css` (currently `#8800FF`, a third purple) and the `NEW_UI` shadow values. That is a deliberate design change: do it as one PR, not piecemeal.

## Typography

**One type system on every page.** Plus Jakarta Sans (`--font-jakarta`) with Mukta (`--font-mukta`) as the Devanagari fallback, set once in `app/layout.tsx`, `utils/theme.ts` and `app/globals.css`. Never set `fontFamily` in a component. Native controls, chart labels (`svg text`), toasts and Swiper inherit it (`app/globals.css`, `app/providers.tsx`).

- **Weights: 400, 500, 600, 700 only.** No 800 or 900 (ESLint blocks them). Mukta loads exactly 400/500/600/700.
- **Letter-spacing:** none, or `-0.01em` on large headings. Do not invent other values.
- **Sizes:** use the theme variants below; do not hand-roll a new size for a heading.

Use MUI `Typography` variants; the scale is fluid (`clamp()`) and defined once in `utils/theme.ts`:

| Variant | Size | Weight | Use |
| --- | --- | --- | --- |
| `h1` | 2.25 to 4 rem | 700 | One per page (hero) |
| `h2` | 1.875 to 3 rem | 700 | Page title |
| `h3` | 1.625 to 2.375 rem | 600 | Section title |
| `h4` | 1.375 to 1.875 rem | 600 | Subsection |
| `h5` / `h6` | 1.125 to 1.375 rem | 600 | Card title / small label |
| `body1` / `body2` / `caption` | see theme | 400 | Body / secondary / meta |

Rules: exactly one `h1` per page; do not skip levels; do not set `fontSize` in a component when a variant fits.

## Spacing and layout

Use the **MUI spacing unit** (8 px). The allowed steps map to the brief's 4/8/12/16/24/32/48/64 scale:

| px | `sx` value | Use |
| --- | --- | --- |
| 4 | `0.5` | icon-to-label gap |
| 8 | `1` | tight stacks |
| 12 | `1.5` | chip/input padding |
| 16 | `2` | default gap, card padding on phones |
| 24 | `3` | card padding, section gaps in a card |
| 32 | `4` | between blocks |
| 48 | `6` | between sections on phones |
| 64 | `8` | between sections on desktop |

Radii: 8 (`1`) controls, 12 to 16 (`1.5` to `2`) cards, 20+ tiles/hero, 999 chips. Breakpoints are MUI's (`xs 0`, `sm 600`, `md 900`, `lg 1200`, `xl 1536`); design **mobile first** and check 360 px width. Max content width is `--spacing-8xl` (87.5 rem).

## Components

Build from MUI primitives; share anything used on two or more pages in `components/common/`.

| Pattern | Rule |
| --- | --- |
| **Button** | MUI `Button`. Primary = `variant="contained"` (violet), secondary = `outlined`, tertiary = `text`. One primary per view. `textTransform: none`. Min touch target 44 px. Loading state disables the button and shows a spinner, never changes its width. |
| **Card** | `Paper`/`Box` with `bgcolor: background.paper`, radius 2, border `NEW_UI.CARD_BORDER_LIGHT`, shadow `NEW_UI.CARD_SHADOW_LIGHT`, hover shadow `CARD_SHADOW_HOVER_LIGHT`. Whole card is one link/button, not a card with three links. |
| **Input** | React Hook Form `Controller` + MUI `TextField`. Visible label (not placeholder-only), helper text shows the Yup message, `error` prop from field state. |
| **Chip** | MUI `Chip`; category chips use `CategoryIcon` inline (no tile). |
| **Icon** | **Category icons** only through `CategoryIcon` (Iconify Phosphor duotone, bundled in `data/categoryIcons.json`, never fetched). UI icons from `@mui/icons-material` (rounded variants: `*RoundedIcon`). Add a Phosphor icon with `npm run icons:category`. |
| **Image** | `next/image` always. Cloudinary URLs use `lib/cloudinaryLoader.ts`; other hosts must be in `next.config.ts → images.remotePatterns`. Give `sizes`; use `priority` only above the fold. Decorative images: `alt=""`. |
| **Skeleton** | MUI `Skeleton` matching the final layout, so nothing jumps. |
| **Toast** | `react-hot-toast` for transient confirmations/errors. |
| **Empty / error state** | Say what happened and offer the next action. Never fall back to fake data (see `01-project-overview.md`, rule 4). |

## Motion

Library: Framer Motion (and MUI transitions for simple fades). Motion explains, it never decorates.

| Type | Duration | Easing |
| --- | --- | --- |
| Micro (hover, press, toggle, focus) | **150 to 250 ms** | `ease-out` |
| Enter / exit (modal, drawer, menu) | 200 to 300 ms | `ease-out` in, `ease-in` out |
| Scroll reveal | **400 to 600 ms**, once, ≤ 24 px travel | `ease-out` |

Rules:
- Animate `transform` and `opacity` only. Never animate `width`, `height`, `top` or `left`.
- **Respect `prefers-reduced-motion`.** `app/globals.css` already has global `@media (prefers-reduced-motion: reduce)` rules for CSS animation. Framer Motion does not read that query by itself: any new Framer animation must use `useReducedMotion()` and replace movement with an instant or opacity-only change (no component does this yet). Scroll reveals must render their content visible without JS motion (`hooks/useScrollReveal.ts`).
- **Feed motion** lives in `components/pages/feed/feedMotion.ts` (spring, durations, stagger). Pieces: sliding-pill `FeedTabs`, animated `LikeButton` (spring pop, spark ring, double-tap heart, sliding count), `BackToTop` (scroll-progress ring, on the left because Kart AI owns the right edge on phones), staggered stories and suggestions, cards that rise in once. Every one reads `useReducedMotion()`; none loops.
- No looping animation except spinners and skeleton shimmer. Nothing auto-plays sound.
- Never delay content behind an animation; above-the-fold content must not wait for one.

## Accessibility baseline

Visible focus ring on everything interactive; contrast ≥ 4.5:1 for text (violet `#5e18e9` on white passes); every control reachable and operable by keyboard; images have alt text or `alt=""`; form fields have labels; touch targets ≥ 44 px; one `h1` per page; do not convey meaning by colour alone.
