'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

export function ProfileShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-full border border-[#d8e1ef] bg-white px-6 py-4 text-sm font-black text-[#173c78] shadow-[0_10px_24px_rgba(16,36,79,0.08)] transition hover:-translate-y-0.5"
      aria-label="Copy profile page URL"
    >
      {copied ? <Check className="h-4 w-4 text-[#007979]" /> : <Share2 className="h-4 w-4" />}
      {copied ? 'Copied' : 'Share'}
    </button>
  )
}
