import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function AvatarBubble({ index, title }: { index: number; title: string }) {
  const initials = title.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'PX'
  const positions = [
    'left-[3%] top-[24%]',
    'left-[12%] bottom-[22%]',
    'left-[24%] top-[42%]',
    'right-[8%] top-[18%]',
    'right-[5%] bottom-[28%]',
    'right-[22%] top-[48%]',
  ]

  return (
    <div className={`absolute hidden h-24 w-24 rounded-full border border-white/18 bg-[#234986]/90 shadow-[0_0_0_8px_rgba(255,255,255,0.06),0_0_0_16px_rgba(255,255,255,0.04),0_0_0_24px_rgba(255,255,255,0.02)] md:flex ${positions[index % positions.length]} items-center justify-center`}>
      <span className="text-lg font-black tracking-[0.08em] text-white">{initials}</span>
    </div>
  )
}

function FeaturedArticle({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group relative flex min-h-[320px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 p-6 shadow-[0_28px_60px_rgba(5,17,46,0.3)] backdrop-blur">
      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-28 transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,39,81,0.12),rgba(12,28,59,0.82))]" />
      <div className="relative z-10 mt-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-gold)]">Featured feature</p>
        <h3 className="mt-4 max-w-xl font-serif text-3xl font-bold leading-[0.98] tracking-[-0.04em] text-white sm:text-4xl">{post.title}</h3>
        <p className="mt-4 max-w-lg text-sm leading-7 text-white/78">{getEditableExcerpt(post, 150)}</p>
      </div>
    </Link>
  )
}

function EditorialListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex gap-4 rounded-[1.6rem] border border-white/10 bg-white/10 p-4 backdrop-blur transition hover:-translate-y-1 hover:bg-white/14">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-gold)] text-sm font-black text-[#173c78]">{index + 1}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/60">Editorial pick</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.03em] text-white">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/66">{getEditableExcerpt(post, 96)}</p>
      </div>
    </Link>
  )
}

function LogoBar() {
  const names = ['BUSINESS INSIDER', 'THE HUFFINGTON POST', 'Inc.', 'TNW', 'YAHOO!', 'Forbes', 'Marketing Land', 'SEJ']
  return (
    <section className="border-y border-[#e2e7f2] bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8b95a8]">Featured in</p>
        <div className="mt-6 grid grid-cols-2 gap-6 text-center text-xl font-bold tracking-[-0.03em] text-[#9aa4b5] sm:grid-cols-4 lg:grid-cols-8">
          {names.map((name) => <span key={name}>{name}</span>)}
        </div>
      </div>
    </section>
  )
}

function BenefitRow({ title, body, imageSrc, reverse = false }: { title: string; body: string; imageSrc: string; reverse?: boolean }) {
  return (
    <div className={`grid gap-10 py-10 lg:grid-cols-2 lg:items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className="flex justify-center">
        <div className="flex h-[280px] w-full max-w-[420px] items-center justify-center overflow-hidden rounded-[2.2rem]">
          <img src={imageSrc} alt={title} className="h-full w-full object-contain" />
        </div>
      </div>
      <div>
        <h3 className="font-serif text-4xl font-bold tracking-[-0.04em] text-[#173c78]">{title}</h3>
        <p className="mt-4 max-w-xl text-base leading-8 text-[#64738d]">{body}</p>
      </div>
    </div>
  )
}

function TestimonialBand() {
  const testimonialFaces = [
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://randomuser.me/api/portraits/women/17.jpg',
  ]

  return (
    <section className="bg-[#72c8e5]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-5xl font-bold tracking-[-0.04em] text-[#173c78]">Testimonials</h2>
        <p className="mt-4 text-lg text-[#173c78]/80">A premium homepage should still feel warm, clear, and easy to trust.</p>
        <div className="mt-10 flex justify-center gap-5">
          {testimonialFaces.map((face, item) => (
            <div key={face} className={`${item === 2 ? 'h-28 w-28' : 'h-16 w-16'} overflow-hidden rounded-full border-4 border-white/70 bg-white/55 shadow-[0_12px_30px_rgba(23,60,120,0.16)]`}>
              <img src={face} alt={`Testimonial avatar ${item + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-4xl text-2xl italic leading-relaxed text-[#173c78]">“This interface feels less like a stock theme and more like a polished digital publication with room for discovery.”</p>
      </div>
    </section>
  )
}

function MosaicCard({ post, href, style }: { post: SitePost; href: string; style: 'wide' | 'tall' | 'compact' | 'image' }) {
  const styleMap = {
    wide: 'sm:col-span-2 min-h-[300px]',
    tall: 'row-span-2 min-h-[420px]',
    compact: 'min-h-[220px]',
    image: 'min-h-[260px]',
  }

  return (
    <Link href={href} className={`group relative overflow-hidden rounded-[1.9rem] border border-[#d4deef] bg-white shadow-[0_18px_48px_rgba(16,36,79,0.1)] ${styleMap[style]}`}>
      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className={`absolute inset-0 ${style === 'compact' ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(16,36,79,0.84))]' : 'bg-[linear-gradient(180deg,rgba(16,36,79,0.0),rgba(16,36,79,0.76))]'}`} />
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-gold)]">{style === 'image' ? 'Image-first' : style === 'wide' ? 'Featured view' : style === 'tall' ? 'Editorial spotlight' : 'Quick read'}</p>
        <h3 className="mt-3 line-clamp-3 font-serif text-2xl font-bold leading-tight text-white">{post.title}</h3>
      </div>
    </Link>
  )
}

function BlogGrid({ primaryTask, primaryRoute, posts }: { primaryTask: TaskKey; primaryRoute: string; posts: SitePost[] }) {
  return (
    <section className="bg-[#f7f5f2]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-serif text-5xl font-bold tracking-[-0.04em] text-[#173c78]">Feature Uploads</h2>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          {posts.slice(0, 6).map((post) => (
            <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group rounded-[1.4rem] border border-[#d8e1ef] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[16/10] rounded-[1rem] bg-[#edf2f8]">
                <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full rounded-[1rem] object-cover" />
              </div>
              <h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight tracking-[-0.03em] text-[#173c78]">{post.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6b7890]">{getEditableExcerpt(post, 90)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroTitle = pagesContent.home.hero.title.join(' ')
  const feature = posts[0]
  const list = posts.slice(1, 4)

  return (
    <>
      <section className="relative overflow-hidden bg-[#183f7a] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,0.09),transparent_18%),radial-gradient(circle_at_50%_54%,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_50%_72%,rgba(255,255,255,0.05),transparent_34%)]" />
        <div className="absolute left-1/2 top-[14%] hidden h-[560px] w-[560px] -translate-x-1/2 rounded-full border border-dashed border-white/12 lg:block" />
        <div className="absolute left-1/2 top-[20%] hidden h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-dashed border-white/12 lg:block" />
        <div className="absolute left-1/2 top-[26%] hidden h-[280px] w-[280px] -translate-x-1/2 rounded-full border border-dashed border-white/12 lg:block" />
        {posts.slice(0, 6).map((post, index) => <AvatarBubble key={`${post.id || post.slug}-bubble`} index={index} title={post.title} />)}
        <div className="relative mx-auto max-w-[1280px] px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--slot4-gold)]">{pagesContent.home.hero.badge}</p>
            <h1 className="mx-auto mt-6 max-w-4xl font-serif text-5xl font-bold leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-[4.6rem]">{heroTitle}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">{pagesContent.home.hero.description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/signup" className={dc.button.primary}>Register now</Link>
              <Link href="/contact" className={dc.button.secondary}>Contact us</Link>
            </div>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            {feature ? <FeaturedArticle post={feature} href={postHref(primaryTask, feature, primaryRoute)} /> : null}
            <div className="grid gap-4">
              {list.map((post, index) => <EditorialListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
              <div className="rounded-[1.8rem] border border-white/10 bg-white p-5 text-[#173c78] shadow-[0_24px_50px_rgba(12,28,59,0.2)]">
                <div className="flex gap-5 text-xs font-black uppercase tracking-[0.18em] text-[#96a2b5]">
                  <span className="text-[#ff6d57]">Cooking</span>
                  <span>DIY</span>
                  <span>Design</span>
                  <span>Fashion</span>
                </div>
                <div className="mt-5 space-y-4">
                  <div className="rounded-[1rem] bg-[#f7f4f1] p-4 text-sm leading-6">“Fresh image stories and compact updates keep the homepage moving without feeling crowded.”</div>
                  <div className="rounded-[1rem] bg-[#f7f4f1] p-4 text-sm leading-6">“Varied cards create a more magazine-like browsing flow across sections.”</div>
                  <div className="rounded-[1rem] bg-[#f7f4f1] p-4 text-sm leading-6">“The layout stays readable even when summaries, images, or categories are light.”</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LogoBar />
    </>
  )
}

export function EditableStoryRail({ posts: _posts }: HomeSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-5xl font-bold tracking-[-0.04em] text-[#173c78]">Why Use {SITE_CONFIG.name}?</h2>
          <div className="mx-auto mt-5 h-1 w-16 bg-[#ff6d57]" />
          <p className="mt-6 text-lg text-[#64738d]">Learn how a more premium front page can amplify images, stories, and discovery.</p>
        </div>
        <div className="mt-14 divide-y divide-[#e6ebf4]">
          <BenefitRow title="Get more visibility" body="Large editorial moments, brighter hierarchy, and deliberate card variety make standout posts easier to notice at first glance." imageSrc="/visibility.png" />
          <BenefitRow title="Find great content" body="Search-first interactions and curated sections help visitors move quickly between popular stories, visual posts, and supporting resources." imageSrc="/content.png" reverse />
          <BenefitRow title="Identify featured voices" body="Profile-linked content, image-led modules, and featured picks create stronger identity cues without overwhelming the page." imageSrc="/featuredvoice.png" />
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  return (
    <section className="bg-[#f6f3ee]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-5xl font-bold tracking-[-0.04em] text-[#173c78]">{SITE_CONFIG.name} for modern discovery</h2>
          <div className="mx-auto mt-5 h-1 w-16 bg-[#ff6d57]" />
        </div>
       
        <div className="mt-10 text-center">
          <Link href={primaryRoute} className={dc.button.primary}>Get started</Link>
        </div>
      </div>
      <TestimonialBand />
      <div className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-5xl font-bold tracking-[-0.04em] text-[#173c78]">Find out why image-rich publishing deserves a better front page</h2>
          <div className="mx-auto mt-5 h-1 w-16 bg-[#ff6d57]" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#6b7890]">A premium cover layout, varied cards, and clean archive pages make the entire site feel more credible and easier to browse.</p>
          <div className="mt-8">
            <Link href={primaryRoute} className={dc.button.primary}>Join today</Link>
          </div>
        </div>
      </div>
      <div className="bg-[#f7f5f2]">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid auto-rows-[220px] gap-5 md:grid-cols-3">
            {posts.slice(0, 8).map((post, index) => {
              const styles: Array<'wide' | 'tall' | 'compact' | 'image'> = ['wide', 'compact', 'image', 'tall', 'compact', 'image', 'wide', 'compact']
              return <MosaicCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} style={styles[index] || 'compact'} />
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts: _posts, timeSections }: HomeSectionProps) {
  const highlightPosts = timeSections.flatMap((section) => section.posts)

  return (
    <>
      <BlogGrid primaryTask={primaryTask} primaryRoute={primaryRoute} posts={highlightPosts} />
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-[2.4rem] border border-[#d8e1ef] bg-[linear-gradient(135deg,#173c78,#1b4f8f)] p-8 text-white shadow-[0_30px_80px_rgba(16,36,79,0.18)] lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-gold)]">Search the edition</p>
              <h2 className="mt-4 font-serif text-5xl font-bold tracking-[-0.04em]">Find the next visual, story, or profile without breaking your flow.</h2>
            </div>
            <form action="/search" className="self-center">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex h-14 flex-1 items-center rounded-[0.9rem] bg-white px-4 text-[#173c78]">
                  <Search className="h-5 w-5 text-[#007979]" />
                  <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-[#173c78]/45" />
                </label>
                <button className="h-14 rounded-[0.9rem] bg-[var(--slot4-gold)] px-7 text-sm font-black uppercase tracking-[0.08em] text-[#173c78]">Search</button>
              </div>
              
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="bg-[#f7f5f2]">
      <div className="mx-auto max-w-[1280px] px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#007979]">{pagesContent.home.cta.badge}</p>
        <h2 className="mx-auto mt-4 max-w-4xl font-serif text-5xl font-bold tracking-[-0.04em] text-[#173c78]">{pagesContent.home.cta.title}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#6c7890]">{pagesContent.home.cta.description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={pagesContent.home.cta.primaryCta.href} className={dc.button.primary}>{pagesContent.home.cta.primaryCta.label} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center justify-center rounded-[0.8rem] border border-[#d0d9ea] bg-white px-8 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-[#173c78] transition hover:-translate-y-0.5">Contact</Link>
        </div>
      </div>
    </section>
  )
}
