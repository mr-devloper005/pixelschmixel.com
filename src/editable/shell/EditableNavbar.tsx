'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled).slice(0, 3), [])
  const navVars = {
    '--editable-nav-bg': '#173c78',
    '--editable-nav-text': '#ffffff',
    '--editable-nav-muted': 'rgba(255,255,255,0.72)',
    '--editable-border': 'rgba(255,255,255,0.16)',
    '--editable-container': '1280px',
  } as CSSProperties

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[92px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          <span className="hidden text-[2rem] font-black tracking-[-0.05em] leading-none sm:block">{SITE_CONFIG.name.toLowerCase()}</span>
        </Link>

        <div className="ml-auto hidden items-center gap-8 lg:flex">
          <Link href={navItems[0]?.route || '/article'} className="text-sm font-black uppercase tracking-[0.08em] hover:text-[var(--slot4-gold)]">
            Features 
          </Link>
          {/* <Link href={navItems[1]?.route || '/image'} className="text-sm font-black uppercase tracking-[0.08em] hover:text-[var(--slot4-gold)]">Blog</Link> */}
          <Link href="/contact" className="text-sm font-black uppercase tracking-[0.08em] hover:text-[var(--slot4-gold)]">Contact</Link>
        </div>

        <form action="/search" className="hidden xl:flex">
          <label className="flex h-11 items-center rounded-[0.9rem] border border-white/12 bg-white/8 px-4">
            <Search className="h-4 w-4 text-white/65" />
            <input name="q" placeholder="Search" className="w-44 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-white/45" />
          </label>
        </form>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <span className="rounded-[0.8rem] border border-white/16 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/80">{session.name}</span>
              <button type="button" onClick={logout} className="rounded-[0.8rem] border border-[var(--slot4-gold)] px-5 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-[var(--slot4-gold)]">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-[0.8rem] border border-[var(--slot4-gold)] px-5 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-[var(--slot4-gold)]">
                Sign in
              </Link>
              <Link href="/signup" className="rounded-[0.8rem] bg-[var(--slot4-gold)] px-5 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-[#173c78]">
                Register
              </Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="ml-auto rounded-[0.9rem] border border-white/14 p-2.5 lg:hidden" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/12 bg-[#16346a] px-4 py-4 lg:hidden">
          <form action="/search" className="mb-4">
            <label className="flex h-11 items-center rounded-[0.9rem] border border-white/12 bg-white/8 px-4">
              <Search className="h-4 w-4 text-white/65" />
              <input name="q" placeholder="Search" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-white/45" />
            </label>
          </form>
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, { label: 'Features', href: navItems[0]?.route || '/article' }, { label: 'Blog', href: navItems[1]?.route || '/image' }, { label: 'Contact', href: '/contact' }].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`rounded-[1rem] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] ${active ? 'bg-white text-[#173c78]' : 'border border-white/10 bg-white/5'}`}>
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-black uppercase tracking-[0.08em]">
                Sign out
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm font-black uppercase tracking-[0.08em]"><LogIn className="h-4 w-4" /> Sign in</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 rounded-[1rem] bg-[var(--slot4-gold)] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#173c78]"><UserPlus className="h-4 w-4" /> Register</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
