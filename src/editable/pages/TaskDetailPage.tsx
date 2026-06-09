import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { ProfileShareButton } from '@/editable/components/ProfileShareButton'
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

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
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

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
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
  const heroImage = images[0] || '/placeholder.svg'
  const galleryImages = images.length > 1 ? images.slice(1, 7) : [heroImage]
  const website = getField(post, ['website', 'url', 'link'])
  const author = post.authorName || asText(getContent(post).author) || SITE_CONFIG.name
  const published = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''
  const category = categoryOf(post, 'Image story')
  return (
    <section className="bg-[#f3efe7]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <BackLink task="image" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.28fr_0.72fr]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[2.6rem] border border-[#d8cfbf] bg-[#fbf8f1] shadow-[0_28px_70px_rgba(87,59,28,0.09)]">
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <figure className="min-h-[420px] border-b border-[#d8cfbf] bg-[#e9e1d5] lg:min-h-[620px] lg:border-b-0 lg:border-r">
                  <img src={heroImage} alt={post.title} className="h-full w-full object-cover" />
                </figure>
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cfbf] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#8c5a2b]">
                      <Camera className="h-4 w-4" />
                      {category}
                    </div>
                    <h1 className="mt-5 font-serif text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[#1d3557] sm:text-5xl">{post.title}</h1>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      
                     
                    </div>

                    <div className="rounded-[1.6rem] border border-[#d8cfbf] bg-white p-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8c5a2b]">Story brief</p>
                      <BodyContent post={post} compact />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2.6rem] border border-[#d8cfbf] bg-[#fffdf8] p-5 shadow-[0_22px_60px_rgba(87,59,28,0.08)] sm:p-6 lg:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8c5a2b]">Image strip</p>
                  <h2 className="mt-3 font-serif text-3xl font-bold tracking-[-0.05em] text-[#1d3557] sm:text-4xl">A studio-style layout with stacked frames.</h2>
                </div>
               
              </div>

              <div className="mt-8 grid gap-5">
                {(images.length ? images : [heroImage]).map((image, index) => (
                  <figure
                    key={`${image}-${index}`}
                    className={`grid gap-0 overflow-hidden rounded-[2rem] border border-[#d8cfbf] bg-white shadow-[0_16px_40px_rgba(87,59,28,0.08)] ${index % 2 === 0 ? 'lg:grid-cols-[1.2fr_0.8fr]' : 'lg:grid-cols-[0.8fr_1.2fr]'}`}
                  >
                    <img src={image} alt={`${post.title} image ${index + 1}`} className={`h-full min-h-[280px] w-full object-cover ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`} />
                    <figcaption className={`flex flex-col justify-center p-6 lg:p-8 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8c5a2b]">Frame {index + 1}</p>
                      <h3 className="mt-3 font-serif text-2xl font-bold tracking-[-0.04em] text-[#1d3557]">{index === 0 ? 'Opening visual' : `Gallery moment ${index + 1}`}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#6f6a61]">
                        {index === 0 ? 'The lead image establishes the tone of the post and gives the page a more gallery-like opening.' : 'Each image sits in its own presentation block so the page feels paced, deliberate, and easier to browse.'}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.4rem] border border-[#d8cfbf] bg-[#1d3557] p-6 text-white shadow-[0_28px_70px_rgba(29,53,87,0.2)] sm:p-7 lg:sticky lg:top-24">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f4c96b]">Collection notes</p>
              <div className="mt-5 space-y-3">
                <div className="rounded-[1.2rem] border border-white/12 bg-white/8 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Category</p>
                  <p className="mt-2 font-black">{category}</p>
                </div>
                <div className="rounded-[1.2rem] border border-white/12 bg-white/8 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Author</p>
                  <p className="mt-2 font-black">{author}</p>
                </div>
                
              </div>

             
              <ContactAction website={website} dark />
            </div>

            
            </div>
        </div>
      </div>
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
  const summary = summaryText(post)
  const memberId = `#${(post.id || post.slug).replace(/[^a-zA-Z0-9]/g, '').slice(0, 6) || '000001'}`
  const navTabs = ['About']
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      
      <div className="mt-8 overflow-hidden rounded-[2.8rem] border border-[#d8e1ef] bg-white shadow-[0_28px_80px_rgba(16,36,79,0.12)]">
        <div className="bg-[linear-gradient(135deg,#ffffff_0%,#ffffff_68%,#f4f8fc_100%)] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#f57c00] text-white shadow-[0_18px_36px_rgba(245,124,0,0.24)]">
              {images[0] ? <img src={images[0]} alt={post.title} className="h-full w-full object-cover" /> : <span className="text-5xl font-light">{post.title.charAt(0).toUpperCase() || 'P'}</span>}
            </div>

            <div>
              <h1 className="font-serif text-4xl font-bold leading-[0.96] tracking-[-0.05em] text-[#173c78] sm:text-5xl">{post.title}</h1>
              
              
            </div>

            <div className="flex flex-wrap justify-start gap-3 lg:justify-end">
              <ProfileShareButton />
              <Link href="/login" className="rounded-full bg-[#ff6d57] px-8 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(255,109,87,0.28)]">Follow</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e8eef5] px-6 py-5 sm:px-8 lg:px-10">
          <div className="flex flex-wrap gap-3">
            {navTabs.map((tab, index) => (
              <span key={tab} className={`rounded-full px-4 py-2 text-sm font-semibold ${index === 0 ? 'bg-[#eef3f8] text-[#173c78]' : 'text-[#173c78]'}`}>
                {tab}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <div className="rounded-[2.2rem] border border-[#d8e1ef] bg-white p-6 shadow-[0_18px_50px_rgba(16,36,79,0.08)] sm:p-8">
            <h2 className="font-serif text-3xl font-bold tracking-[-0.04em] text-[#173c78]">About</h2>
            <BodyContent post={post} />
          </div>

          {(website || email) ? (
            <div className="rounded-[2.2rem] border border-[#d8e1ef] bg-white p-6 shadow-[0_18px_50px_rgba(16,36,79,0.08)] sm:p-8">
              <h2 className="font-serif text-3xl font-bold tracking-[-0.04em] text-[#173c78]">Links</h2>
              <div className="mt-6 grid gap-3">
                {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-[1.2rem] border border-[#d8e1ef] bg-[#f8fbff] px-4 py-4 text-base font-semibold text-[#173c78]"><Globe2 className="h-5 w-5 text-[#007979]" /> Website</Link> : null}
                {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-3 rounded-[1.2rem] border border-[#d8e1ef] bg-[#f8fbff] px-4 py-4 text-base font-semibold text-[#173c78]"><Mail className="h-5 w-5 text-[#007979]" /> {email}</a> : null}
              </div>
            </div>
          ) : null}

          
        </div>

        <aside className="space-y-6">
          {images.slice(1).length ? (
            <div className="rounded-[2.2rem] border border-[#d8e1ef] bg-white p-5 shadow-[0_18px_50px_rgba(16,36,79,0.08)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#007979]">Profile gallery</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {images.slice(1, 5).map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${post.title} gallery ${index + 1}`} className="aspect-square rounded-[1.4rem] object-cover" />)}
              </div>
            </div>
          ) : null}

          <div className="rounded-[2.2rem] border border-[#d8e1ef] bg-[#173c78] p-6 text-white shadow-[0_22px_60px_rgba(16,36,79,0.16)]">
           
            <ContactAction website={website} email={email} dark />
          </div>

           </aside>
      </div>
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
