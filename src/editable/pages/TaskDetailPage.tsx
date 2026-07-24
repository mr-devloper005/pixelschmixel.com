import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const dedupeUrls = (urls: Array<string | null | undefined>): string[] =>
  Array.from(new Set(urls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter((url) => url.length > 0)))

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return dedupeUrls([...media, ...images, ...singleImages]).filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const summaryText = (post: SitePost) => {
  const raw = post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
  return /<[a-z][\s\S]*>/i.test(raw) ? stripHtml(raw) : raw
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const detailVars = {
    '--detail-bg': '#f7f4ef',
    '--detail-text': '#173c78',
    '--detail-surface': '#ffffff',
    '--detail-accent': '#007979',
    '--editable-border': '#d8e1ef',
    '--editable-container': '1280px',
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-[0.8rem] border border-[#d8e1ef] bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-[#173c78]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function DetailFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`rounded-[2.6rem] border p-6 shadow-[0_30px_90px_rgba(16,36,79,0.09)] sm:p-8 lg:p-10 ${dark ? 'border-white/12 bg-[linear-gradient(150deg,#173c78,#1f4e8f)] text-white' : 'border-[#d8e1ef] bg-white text-[#173c78]'}`}>
      {children}
    </div>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <DetailFrame>
        <BackLink task="article" />
        <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-[#007979]">{categoryOf(post, 'Article')}</p>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-[0.96] tracking-[-0.06em] sm:text-5xl lg:text-7xl">{post.title}</h1>
        {images[0] ? <img src={images[0]} alt={post.title} className="mt-8 max-h-[620px] w-full rounded-[2rem] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableComments slug={post.slug} comments={comments} />
      </DetailFrame>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <DetailFrame>
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[2rem] bg-[#eef3f8] ring-1 ring-[#d8e1ef]">
              {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 text-[#6a7891]" />}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#007979]">Business listing</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-6xl">{post.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#6a7891]">{summaryText(post)}</p>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </DetailFrame>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16">
      <DetailFrame dark>
        <BackLink task="classified" />
        <p className="mt-10 text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-gold)]">Classified notice</p>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-5xl">{post.title}</h1>
        <div className="mt-8 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-[0.8rem] bg-[var(--slot4-gold)] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#173c78]">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-[0.8rem] border border-white/18 px-5 py-3 text-sm font-black uppercase tracking-[0.08em]">Email</a> : null}
        </div>
      </DetailFrame>
      <DetailFrame>
        <ImageStrip images={images} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </DetailFrame>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <DetailFrame dark>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--slot4-gold)]"><Camera className="h-4 w-4" /> Image story</div>
          <h1 className="mt-6 font-serif text-4xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-5xl">{post.title}</h1>
                                      
          <BodyContent post={post} compact dark />
        </DetailFrame>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-[#d8e1ef] bg-white shadow-[0_16px_40px_rgba(16,36,79,0.08)]">
              <img src={image} alt={post.title} className="w-full object-cover" />
              {index === 0 ? <figcaption className="p-5 text-sm font-semibold text-[#6a7891]">Featured visual from this image post.</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10"><RelatedPanel task="image" post={post} related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <DetailFrame>
        <BackLink task="sbm" />
        <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#173c78] text-white"><Bookmark className="h-9 w-9" /></div>
        <h1 className="mt-7 font-serif text-4xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-6xl">{post.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-[#6a7891]">{summaryText(post)}</p>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-[0.8rem] bg-[var(--slot4-gold)] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#173c78]">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
        <BodyContent post={post} />
      </DetailFrame>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <DetailFrame>
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
          <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[#173c78] text-white"><FileText className="h-12 w-12" /></div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#007979]">PDF resource</p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-6xl">{post.title}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#d8e1ef] bg-[#f3f7fb]">
            <div className="flex items-center justify-between gap-3 border-b border-[#d8e1ef] bg-white p-4">
              <span className="text-sm font-black">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-[0.8rem] bg-[#173c78] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Download <Download className="h-4 w-4" /></Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </DetailFrame>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8 lg:py-16">
      <DetailFrame dark>
        <BackLink task="profile" />
        <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/12">
          {images[0] ? <img src={images[0]} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 text-white/60" />}
        </div>
        <h1 className="mt-6 text-center font-serif text-4xl font-bold leading-[0.98] tracking-[-0.06em]">{post.title}</h1>
        {role ? <p className="mt-3 text-center text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-gold)]">{role}</p> : null}
        <ContactAction website={website} email={email} dark />
      </DetailFrame>
      <DetailFrame>
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </DetailFrame>
    </section>
  )
}

function BodyContent({ post, compact = false, dark = false }: { post: SitePost; compact?: boolean; dark?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} ${dark ? 'text-white/78 [&_h2]:text-white [&_h3]:text-white [&_a]:text-[var(--slot4-gold)]' : ''}`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[#d8e1ef] bg-[#f7fafc] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#007979]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[#173c78]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007979]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt={label} className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-[#d8e1ef]" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#d8e1ef] bg-white shadow-[0_16px_40px_rgba(16,36,79,0.08)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black text-[#173c78]"><MapPin className="h-4 w-4 text-[#007979]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, dark = false }: { website?: string; phone?: string; email?: string; dark?: boolean }) {
  if (!website && !phone && !email) return null
  return (
    <div className={`mt-5 rounded-[2rem] border p-5 shadow-sm ${dark ? 'border-white/12 bg-white/8 text-white' : 'border-[#d8e1ef] bg-white text-[#173c78]'}`}>
      <p className={`text-xs font-black uppercase tracking-[0.22em] ${dark ? 'text-[var(--slot4-gold)]' : 'text-[#007979]'}`}>Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-[0.8rem] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] ${dark ? 'bg-[var(--slot4-gold)] text-[#173c78]' : 'bg-[#173c78] text-white'}`}>Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className={`inline-flex items-center gap-2 rounded-[0.8rem] border px-4 py-2 text-sm font-black uppercase tracking-[0.08em] ${dark ? 'border-white/18' : 'border-[#d8e1ef]'}`}><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className={`inline-flex items-center gap-2 rounded-[0.8rem] border px-4 py-2 text-sm font-black uppercase tracking-[0.08em] ${dark ? 'border-white/18' : 'border-[#d8e1ef]'}`}><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-[1rem] border border-white/14 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] text-white/60">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact ? (
        <div className="rounded-[2rem] border border-[#d8e1ef] bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#007979]">About this post</p>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[#6a7891]">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[#007979]" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#007979]" /> Site: {SITE_CONFIG.name}</p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-[#d8e1ef] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-bold tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[#007979]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-[1.4rem] border border-[#d8e1ef] bg-[#f9fbff] p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
      {image && task !== 'sbm' ? <img src={image} alt={post.title} className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#eef3f8]"><FileText className="h-6 w-6 text-[#6a7891]" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em] text-[#173c78]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#6a7891]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-[#d8e1ef] bg-[#f9fbff] p-5">
      <div className="flex items-center gap-2 font-serif text-2xl font-bold text-[#173c78]"><MessageCircle className="h-5 w-5 text-[#007979]" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.4rem] border border-[#d8e1ef] bg-white p-4">
            <p className="text-sm font-black text-[#173c78]">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-[#6a7891]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[#6a7891]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
