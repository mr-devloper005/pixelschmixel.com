import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[2rem] border border-[#d8e1ef] bg-white p-8 text-center shadow-[0_20px_50px_rgba(16,36,79,0.08)]', className)}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#173c78] text-white">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="mt-5 font-serif text-3xl font-bold tracking-[-0.03em] text-[#173c78]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6a7891]">{description}</p>
      <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 rounded-[0.8rem] bg-[var(--slot4-gold)] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#173c78] transition hover:-translate-y-0.5">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically. The refreshed layout stays ready even when the feed is empty.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
