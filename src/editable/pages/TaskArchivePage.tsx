import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const dedupeUrls = (urls: Array<string | null | undefined>): string[] =>
  Array.from(new Set(urls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter((url) => url.length > 0)))

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return dedupeUrls([...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])]).filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => {
  const raw = post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
  return raw ? stripHtml(raw) : ''
}
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Large reading cards and editorial hierarchy make longer headlines breathe.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-6 xl:grid-cols-2', promise: 'Directory entries surface location, identity, and practical contact cues.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-6 xl:grid-cols-2', promise: 'Offer cards prioritize price, place, urgency, and direct action.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3', promise: 'Gallery-first browsing puts visual impact ahead of interface noise.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Saved resources stay compact, crisp, and easy to scan quickly.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards feel more like a library shelf than a plain article list.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards foreground identity, role, and trust cues immediately.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = {
    '--archive-bg': '#f6f1eb',
    '--archive-text': '#10244f',
    '--archive-surface': '#ffffff',
    '--archive-accent': '#007979',
    '--editable-border': '#d4deef',
    '--editable-container': '1280px',
  } as CSSProperties
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-[2.2rem] bg-[linear-gradient(150deg,#173c78,#1f4e8f)] p-6 text-white shadow-[0_30px_90px_rgba(16,36,79,0.18)] lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-gold)]"><Icon className="h-4 w-4" /> {voice?.eyebrow || label}</div>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold leading-[0.94] tracking-[-0.06em] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">{voice?.description || SITE_CONFIG.description}</p>
              <div className="mt-6 rounded-[2rem] border border-white/12 bg-white/10 p-4 text-sm font-semibold leading-7 text-white/78">{deck.promise}</div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={basePath} className="rounded-[0.8rem] bg-[var(--slot4-gold)] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#10244f]">Browse all</Link>
                <Link href="/search" className="rounded-[0.8rem] border border-white/12 bg-white/8 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white">Search posts</Link>
              </div>
            </div>

            <div className="self-end rounded-[2rem] border border-white/12 bg-white p-5 text-[#10244f] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#007979]"><Filter className="h-4 w-4" /> {voice?.filterLabel || 'Filter'}</div>
              <form action={basePath} className="mt-4">
                <select name="category" defaultValue={category} className="h-12 w-full rounded-[1rem] border border-[#d4deef] bg-[#f6f7fb] px-4 text-sm font-bold outline-none">
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="mt-3 h-12 w-full rounded-[0.8rem] bg-[#173c78] text-sm font-black uppercase tracking-[0.12em] text-white">Apply</button>
              </form>
              <p className="mt-4 text-sm font-semibold text-[#55637f]">Showing: {categoryLabel}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {voice?.chips?.map((chip) => <span key={chip} className="rounded-full border border-[#d4deef] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#10244f]">{chip}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--editable-border)] bg-white p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-[#007979]" />
              <h2 className="mt-4 font-serif text-3xl font-bold tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm text-[#55637f]">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-[0.8rem] border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.08em]">Previous</Link> : null}
            <span className="rounded-[0.8rem] bg-[#173c78] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-[0.8rem] border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.08em]">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  const featured = index % 5 === 0
  return (
    <Link href={href} className={`group overflow-hidden rounded-[2rem] border border-[#d4deef] bg-white shadow-[0_16px_40px_rgba(16,36,79,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,36,79,0.18)] ${featured ? 'md:col-span-2' : ''}`}>
      <div className={`relative overflow-hidden bg-[#173c78] ${featured ? 'aspect-[16/8]' : 'aspect-[4/3]'}`}>
        <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173c78]/76 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-gold)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#10244f]">{category}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#007979]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 font-serif text-2xl font-bold leading-tight tracking-[-0.04em] text-[#10244f]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#55637f]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[#d4deef] bg-white p-5 shadow-[0_16px_40px_rgba(16,36,79,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,36,79,0.18)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] bg-[#dfe6f0] ring-1 ring-[#d4deef]">
        {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 text-[#55637f]" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#173c78] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[#d4deef] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#10244f]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-[-0.04em] text-[#10244f]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#55637f]">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold text-[#55637f] sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#d4deef] bg-white shadow-[0_16px_40px_rgba(16,36,79,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,36,79,0.18)]">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[linear-gradient(150deg,#173c78,#1e4d8d)] p-5 text-white">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-gold)]">Classified</span>
          <h2 className="mt-10 font-serif text-4xl font-bold leading-[1] tracking-[-0.06em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt={post.title} className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="font-serif text-3xl font-bold leading-tight tracking-[-0.04em] text-[#10244f]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#55637f]">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#007979]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-6 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[#d4deef] bg-white shadow-[0_16px_40px_rgba(16,36,79,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,36,79,0.18)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#dfe6f0] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#10244f]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 font-serif text-2xl font-bold leading-tight tracking-[-0.04em] text-[#10244f]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[2rem] border border-[#d4deef] bg-white p-6 shadow-[0_16px_40px_rgba(16,36,79,0.12)] transition hover:-translate-y-1 hover:bg-[#173c78] hover:text-white hover:shadow-[0_24px_60px_rgba(16,36,79,0.18)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 font-serif text-3xl font-bold leading-tight tracking-[-0.04em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[#d4deef] bg-white p-6 shadow-[0_16px_40px_rgba(16,36,79,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,36,79,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[#173c78] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[#dfe6f0] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#10244f]">{category}</span>
      </div>
      <h2 className="mt-8 font-serif text-3xl font-bold leading-tight tracking-[-0.04em] text-[#10244f]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#55637f]">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#007979]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[#d4deef] bg-white p-6 text-center shadow-[0_16px_40px_rgba(16,36,79,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,36,79,0.18)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#dfe6f0] ring-1 ring-[#d4deef]">
        {avatar ? <img src={avatar} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[#55637f]" />}
      </div>
      <h2 className="mt-5 font-serif text-2xl font-bold leading-tight tracking-[-0.04em] text-[#10244f]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[#007979]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#55637f]">{getSummary(post)}</p>
    </Link>
  )
}
