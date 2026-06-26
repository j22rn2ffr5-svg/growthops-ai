import { TriangleAlert } from 'lucide-react'

/**
 * LegalReviewNotice
 * Displayed at the top of every legal page to flag that the document
 * is a pre-launch placeholder and has not been reviewed by a solicitor.
 * Remove this component from each page before going live.
 */
export default function LegalReviewNotice() {
  return (
    <div
      className="max-w-3xl mx-auto px-6 mb-0 mt-2"
      role="alert"
      aria-label="Draft document notice"
    >
      <div
        className="flex items-start gap-3 px-5 py-4 rounded-2xl"
        style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.28)',
        }}
      >
        <TriangleAlert
          size={16}
          className="flex-shrink-0 mt-0.5"
          style={{ color: '#f59e0b' }}
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#f59e0b' }}>
            Draft — requires legal review before launch
          </p>
          <p className="text-xs leading-relaxed" style={{ color: '#d97706' }}>
            This document was prepared as a working placeholder for pre-launch use. It has not been
            reviewed or approved by a qualified solicitor. Before this site goes live, have all legal
            pages checked by a legal professional to ensure they are accurate, complete, and
            compliant with UK law and your specific business circumstances.
          </p>
        </div>
      </div>
    </div>
  )
}
