'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass = 'rounded-[0.8rem] border border-[#d4deef] bg-white px-4 py-3 text-sm font-semibold text-[#10244f] outline-none transition placeholder:text-[#10244f]/35 focus:border-[#007979]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[#f6f1eb] px-4 py-16 text-[#10244f] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-5xl gap-8 rounded-[2rem] border border-[#d4deef] bg-white p-7 shadow-[0_22px_55px_rgba(16,36,79,0.12)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div className="flex h-full min-h-72 items-center justify-center rounded-[2rem] bg-[#173c78] text-white">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="self-center">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#007979]">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.92] tracking-[-0.05em] sm:text-6xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#55637f]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-[0.8rem] bg-[#173c78] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-[0.8rem] border border-[#d4deef] bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#10244f]">Register</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#f6f1eb] text-[#10244f]">
        <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-[2rem] border border-[#d4deef] bg-white p-6 shadow-[0_22px_55px_rgba(16,36,79,0.12)] lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <aside className="rounded-[2.2rem] bg-[#173c78] p-6 text-white shadow-[0_28px_80px_rgba(7,20,53,0.24)]">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-gold)]">{pagesContent.create.hero.badge}</p>
              <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.92] tracking-[-0.05em] sm:text-6xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/76">{pagesContent.create.hero.description}</p>
            </aside>

            <form onSubmit={submit} className="rounded-[2rem] border border-[#d4deef] bg-[#f6f7fb] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#007979]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 font-serif text-3xl font-bold tracking-[-0.04em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 rounded-[0.8rem] border border-[#d9f4f1] bg-[#d9f4f1] p-4 text-[#007979]">
                  <p className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[0.8rem] bg-[#173c78] px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
