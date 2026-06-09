import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

const loginHighlights = [
  'Jump back into featured stories and image-led posts.',
  'Keep your saved publishing flow in one calm dashboard.',
  'Move between discovery pages without losing momentum.',
]

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="overflow-hidden bg-[linear-gradient(180deg,#f7f4ef_0%,#eef6fb_100%)] text-[#173c78]">
        <section className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="absolute left-[-8rem] top-10 h-64 w-64 rounded-full bg-[#72c8e5]/20 blur-3xl" />
          <div className="absolute bottom-0 right-[-6rem] h-72 w-72 rounded-full bg-[#173c78]/10 blur-3xl" />
          <div className="relative grid min-h-[calc(100vh-13rem)] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2.6rem] border border-white/70 bg-[linear-gradient(145deg,#173c78,#1c4f90)] p-7 text-white shadow-[0_30px_90px_rgba(16,36,79,0.22)] sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-gold)]">
                <Sparkles className="h-4 w-4" />
                {pagesContent.auth.login.badge}
              </div>
              <h1 className="mt-6 max-w-2xl font-serif text-5xl font-bold leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-[4.6rem]">
                {pagesContent.auth.login.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
                {pagesContent.auth.login.description}
              </p>

              <div className="mt-8 grid gap-3">
                {loginHighlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.2rem] border border-white/12 bg-white/8 px-4 py-4 backdrop-blur">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--slot4-gold)]" />
                    <p className="text-sm leading-6 text-white/82">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.4rem] border border-white/12 bg-white/10 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/58">Sessions</p>
                  <p className="mt-3 font-serif text-3xl font-bold tracking-[-0.04em]">24/7</p>
                  <p className="mt-2 text-sm text-white/70">Access your local account any time you want to keep publishing.</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/12 bg-white/10 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/58">Discovery</p>
                  <p className="mt-3 font-serif text-3xl font-bold tracking-[-0.04em]">Fresh</p>
                  <p className="mt-2 text-sm text-white/70">A cleaner editorial flow makes the next action feel obvious.</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/12 bg-white/10 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/58">Access</p>
                  <p className="mt-3 font-serif text-3xl font-bold tracking-[-0.04em]">Simple</p>
                  <p className="mt-2 text-sm text-white/70">Sign in quickly, then get back to the homepage without friction.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold text-white/75">
                <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2">Image-first publishing</span>
                <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2">Modern discovery</span>
                <span className="rounded-full border border-white/14 bg-white/8 px-4 py-2">Cleaner member flow</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-5 top-8 hidden h-24 w-24 rounded-[1.8rem] border border-[#d8e2f1] bg-white/70 shadow-[0_20px_40px_rgba(16,36,79,0.08)] backdrop-blur lg:block" />
              <div className="absolute -right-6 bottom-10 hidden h-32 w-32 rounded-full bg-[#72c8e5]/25 blur-2xl lg:block" />
              <div className="relative rounded-[2.4rem] border border-[#d8e2f1] bg-white/88 p-6 shadow-[0_30px_90px_rgba(16,36,79,0.12)] backdrop-blur sm:p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ff6d57]">Member access</p>
                    <h2 className="mt-3 font-serif text-4xl font-bold tracking-[-0.04em] text-[#173c78]">{pagesContent.auth.login.formTitle}</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#173c78] text-white">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>

                

                <EditableLocalLoginForm />
                <p className="mt-6 text-sm text-[#6a7891]">
                  New here?{' '}
                  <Link href="/signup" className="inline-flex items-center gap-1 font-black text-[#173c78] underline-offset-4 hover:underline">
                    {pagesContent.auth.login.createCta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
