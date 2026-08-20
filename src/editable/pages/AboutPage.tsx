import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f6f1eb] px-4 py-14 text-[#10244f] sm:px-6 lg:px-8">
        <section className="mx-auto max-w-[1280px] rounded-[2rem] border border-[#d4deef] bg-white p-8 shadow-[0_22px_55px_rgba(16,36,79,0.12)] lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <article>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#007979]">{pagesContent.about.badge}</p>
              <h1 className="mt-5 font-serif text-5xl font-bold tracking-[-0.05em] lg:text-6xl">About {SITE_CONFIG.name}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#55637f]">{pagesContent.about.description}</p>
              <div className="mt-8 space-y-4 text-base leading-8 text-[#55637f]">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>
            <aside className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className={`rounded-[2rem] border p-6 shadow-sm ${index === 1 ? 'border-[#173c78] bg-[#173c78] text-white' : 'border-[#d4deef] bg-[#f6f7fb] text-[#10244f]'}`}>
                  <h2 className="font-serif text-3xl font-bold tracking-[-0.03em]">{value.title}</h2>
                  <p className={`mt-3 text-sm leading-7 ${index === 1 ? 'text-white/78' : 'text-[#6f7f98]'}`}>{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
