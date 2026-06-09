import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f6f1eb',
  '--slot4-page-text': '#10244f',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#55637f',
  '--slot4-soft-muted-text': '#6f7f98',
  '--slot4-accent': '#007979',
  '--slot4-accent-fill': '#24b1b1',
  '--slot4-accent-soft': '#d9f4f1',
  '--slot4-dark-bg': '#173c78',
  '--slot4-dark-text': '#fffaf5',
  '--slot4-media-bg': '#dfe6f0',
  '--slot4-cream': '#fff0e4',
  '--slot4-warm': '#ffe0c5',
  '--slot4-lavender': '#edf6f6',
  '--slot4-gray': '#f6f7fb',
  '--slot4-gold': '#ffcb29',
  '--slot4-body-gradient': 'linear-gradient(180deg, #1c4a8c 0%, #183a72 18%, #f9f5ef 18.1%, #ffffff 52%, #f6f1eb 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[#d4deef]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_22px_55px_rgba(16,36,79,0.12)]',
  shadowStrong: 'shadow-[0_28px_80px_rgba(7,20,53,0.24)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(10,24,55,0.04),rgba(10,24,55,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[230px] shrink-0 snap-start',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.28em]',
    heroTitle: 'font-serif text-4xl font-bold leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-[4.5rem]',
    sectionTitle: 'font-serif text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} bg-white/85`,
    dark: `rounded-[2.2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: 'inline-flex items-center justify-center rounded-[0.8rem] bg-[var(--slot4-gold)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-[#173c78] transition hover:-translate-y-0.5 hover:brightness-105',
    secondary: 'inline-flex items-center justify-center rounded-[0.8rem] border border-white/16 bg-[#214785] px-8 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-[#295193]',
    accent: 'inline-flex items-center justify-center rounded-[0.8rem] bg-[var(--slot4-accent-fill)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:brightness-105',
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.5rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(16,36,79,0.18)]',
    fade: 'transition duration-300 hover:opacity-88',
  },
} as const

export const aiLayoutRules = [
  'Keep the hero dark blue, expansive, and reference-like while the rest of the site opens into bright editorial sections.',
  'Use the teal and warm cream palette as accents across buttons, borders, pills, and highlights.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
  'Maintain multiple card styles across archives and content blocks rather than repeating one module everywhere.',
  'Homepage should feel like a premium editorial landing page, not a generic feed grid.',
] as const
