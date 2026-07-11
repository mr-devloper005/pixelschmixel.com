'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-[#cbd7ea] bg-[#173c78] text-white">
      <section className="border-b border-white/12 bg-white/95 text-[#173c78]">
        
              </section>

      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.8fr_0.8fr_0.9fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
            <span>
              <span className="block text-3xl font-black tracking-[-0.05em]">{SITE_CONFIG.name.toLowerCase()}</span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-white/55">{globalContent.footer.tagline}</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/72">{globalContent.footer.description}</p>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.24em] text-white/55">Company</h3>
          <div className="mt-5 grid gap-3">
            <Link href="/" className="text-sm font-bold text-white/80 hover:text-white">Home</Link>
            <Link href="/about" className="text-sm font-bold text-white/80 hover:text-white">About</Link>
            <Link href="/contact" className="text-sm font-bold text-white/80 hover:text-white">Contact</Link>
            {session ? <button type="button" onClick={logout} className="text-left text-sm font-bold text-white/80 hover:text-white">Logout</button> : <Link href="/login" className="text-sm font-bold text-white/80 hover:text-white">Sign in</Link>}
          </div>
        </div>

        
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.24em] text-white/55">Access</h3>
          <div className="mt-5 grid gap-3">
            {!session ? <Link href="/signup" className="text-sm font-bold text-white/80 hover:text-white">Register</Link> : null}
            <Link href="/search" className="text-sm font-bold text-white/80 hover:text-white">Search</Link>
            <Link href="/create" className="text-sm font-bold text-white/80 hover:text-white">Create</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs font-bold uppercase tracking-[0.14em] text-white/55">
        Copyright {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
