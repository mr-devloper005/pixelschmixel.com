import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f7f4ef] text-[#173c78]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1280px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
          <div className="rounded-[2.2rem] border border-[#d6deef] bg-white p-6 shadow-[0_24px_70px_rgba(16,36,79,0.1)] sm:p-8">
            <h1 className="font-serif text-4xl font-bold tracking-[-0.04em]">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-5 text-sm text-[#6a7891]">Already have an account? <Link href="/login" className="font-black text-[#173c78] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
          <div className="rounded-[2.2rem] bg-[linear-gradient(150deg,#173c78,#1e4d8d)] p-8 text-white shadow-[0_28px_70px_rgba(16,36,79,0.18)]">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-gold)]">{pagesContent.auth.signup.badge}</p>
            <h2 className="mt-5 max-w-xl font-serif text-5xl font-bold leading-[0.96] tracking-[-0.05em] sm:text-6xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-white/76">{pagesContent.auth.signup.description}</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
