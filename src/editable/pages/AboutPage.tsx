import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f7f4ef] px-4 py-14 text-[#173c78] sm:px-6 lg:px-8">
        <section className="mx-auto max-w-[1280px] rounded-[2.8rem] border border-[#d8e1ef] bg-white p-8 shadow-[0_24px_60px_rgba(16,36,79,0.08)] lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <article>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#007979]">{pagesContent.about.badge}</p>
              <h1 className="mt-5 font-serif text-5xl font-bold tracking-[-0.05em] lg:text-6xl">About {SITE_CONFIG.name}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#62718b]">{pagesContent.about.description}</p>
              <div className="mt-8 space-y-4 text-base leading-8 text-[#62718b]">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>
            <aside className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className={`rounded-[2rem] border p-6 shadow-sm ${index === 1 ? 'border-[#173c78] bg-[#173c78] text-white' : 'border-[#d8e1ef] bg-[#f9fbff] text-[#173c78]'}`}>
                  <h2 className="font-serif text-3xl font-bold tracking-[-0.03em]">{value.title}</h2>
                  <p className={`mt-3 text-sm leading-7 ${index === 1 ? 'text-white/78' : 'text-[#6a7891]'}`}>{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
