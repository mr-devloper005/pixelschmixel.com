'use client'

import { Building2, FileText, Image as ImageIcon, Mail, Phone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const lanes = [
  { icon: ImageIcon, title: 'Visual features', body: 'Use this lane for image-led launches, collection refreshes, and featured gallery placements.' },
  { icon: FileText, title: 'Editorial planning', body: 'Reach out for story packaging, homepage placement, and longer-form content direction.' },
  { icon: Building2, title: 'Partnerships', body: 'Coordinate profile highlights, publishing collaborations, and premium promotion requests.' },
  { icon: Mail, title: 'Support requests', body: 'Ask about access, workflows, page updates, or anything blocking your publishing flow.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f6f1eb] px-4 py-14 text-[#10244f] sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2.2rem] bg-[#173c78] p-8 text-white shadow-[0_28px_80px_rgba(7,20,53,0.24)] lg:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-gold)]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-5 font-serif text-5xl font-bold tracking-[-0.05em]">{pagesContent.contact.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/78">{pagesContent.contact.description}</p>
            <div className="mt-8 grid gap-4">
              {lanes.map((lane, index) => (
                <div key={lane.title} className={`rounded-[1.8rem] border p-5 ${index === 1 ? 'border-white/12 bg-white/14' : 'border-white/12 bg-white/8'}`}>
                  <lane.icon className="h-5 w-5 text-[var(--slot4-gold)]" />
                  <h2 className="mt-3 text-2xl font-black tracking-[-0.03em]">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/72">{lane.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-white/76">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2"><Phone className="h-4 w-4" /> Fast response</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2"><Sparkles className="h-4 w-4" /> Premium support</span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#d4deef] bg-white p-6 shadow-[0_22px_55px_rgba(16,36,79,0.12)] sm:p-8">
            <h2 className="font-serif text-4xl font-bold tracking-[-0.04em] text-[#10244f]">{pagesContent.contact.formTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#55637f]">Tell us what you want to build, feature, or improve and we will direct it to the right path.</p>
            <div className="mt-6">
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
