import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Editorial discovery for visuals, profiles, and stories',
      description: 'Browse image-led posts, standout profiles, and polished editorial collections through a premium front page experience.',
      openGraphTitle: 'Editorial discovery for visuals, profiles, and stories',
      openGraphDescription: 'A premium editorial homepage for visual posts, profiles, and connected discovery.',
      keywords: ['editorial discovery', 'image posts', 'profile features', 'premium content'],
    },
    hero: {
      badge: '',
      title: ['Amplify your favorite visuals and stories', 'through a sharper editorial front page.'],
      description: 'Discover image-led posts and curated sections arranged with the polish of a premium digital magazine.',
      primaryCta: { label: 'Browse latest stories', href: '/article' },
      secondaryCta: { label: 'Explore visuals', href: '/image' },
      searchPlaceholder: 'Search stories, visuals, creators, and resources',
      focusLabel: 'Focus',
      featureCardBadge: 'editorial motion',
      featureCardTitle: 'The homepage behaves like a living cover, not a plain archive.',
      featureCardDescription: 'Featured content, topic-led sections, and visual cards move visitors deeper into the site without losing clarity.',
    },
    intro: {
      badge: 'Why people browse here',
      title: 'A homepage shaped like a premium edition, not a basic feed.',
      paragraphs: [
        'The experience blends visual discovery with readable editorial pacing so featured content feels curated from the first screen.',
        'Large hero moments, structured topic sections, and varied cards help visitors move naturally between images, stories, profiles, and supporting resources.',
        'Every section keeps the same underlying content flow intact while presenting it with stronger hierarchy and a more distinctive point of view.',
      ],
      sideBadge: 'What changes',
      sidePoints: [
        'Large cover-style hero with layered discovery cues.',
        'Bright editorial sections after the dark opening canvas.',
        'Multiple card treatments across stories, visuals, and supporting content.',
        'Cleaner mobile rhythm with stronger spacing and scanability.',
      ],
      primaryLink: { label: 'Browse articles', href: '/article' },
      secondaryLink: { label: 'See visuals', href: '/image' },
    },
    cta: {
      badge: '',
      title: 'Move between image-led posts and features through one elegant reading flow.',
      description: 'Follow the highlighted stories, search the archive, or step into the latest visual collections from anywhere on the site.',
      primaryCta: { label: 'Browse Images', href: '/image' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About the edition',
    title: 'An editorial surface built for visual-first discovery.',
    description: `${slot4BrandConfig.siteName} pairs clean discovery with a premium reading atmosphere so every section feels more deliberate and memorable.`,
    paragraphs: [
      'The site is designed to make image-led browsing, readable stories, and connected sections feel like one polished product.',
      'Instead of flattening every post into the same module, the interface gives different kinds of content the hierarchy they deserve.',
    ],
    values: [
      {
        title: 'Visual authority',
        description: 'Hero moments, gallery-led layouts, and spacious cards bring stronger presence to image-rich posts.',
      },
      {
        title: 'Editorial rhythm',
        description: 'Large headings, structured sections, and calmer spacing make longer browsing sessions feel easier.',
      },
      {
        title: 'Connected discovery',
        description: 'Stories, visuals, profiles, and resources stay linked through one coherent interface.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Talk to the team behind the next feature, collection, or publishing move.',
    description: 'Share what you want to launch, highlight, or refine. We will keep the conversation focused and route it into the right lane.',
    formTitle: 'Start the conversation',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search stories, topics, profiles, visuals, and resources across the site.',
    },
    hero: {
      badge: 'Editorial search',
      title: 'Find stories, visuals, profiles, and resources with less friction.',
      description: 'Use keywords, categories, and content types to move quickly through the site without losing the premium reading flow.',
      placeholder: 'Search by title, topic, profile, or keyword',
    },
    resultsTitle: 'Fresh searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Sign in to open the publishing studio.',
      description: 'Use your account to access the site’s publishing workflow and prepare new content for any active section.',
    },
    hero: {
      badge: 'Publishing studio',
      title: 'Prepare polished content for every active section.',
      description: 'Choose a content type, add the essentials, and draft a clean post with headline, summary, imagery, and body copy.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member sign in',
      title: 'Return to your premium publishing workspace.',
      description: 'Sign in to continue browsing, saving your place, and creating new entries across the site.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create one first, then sign in.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Create access',
      title: 'Open your account and start publishing with confidence.',
      description: 'Create an account to access the publishing studio, submit new content, and return to your saved workflow.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
