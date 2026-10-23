/**
 * SectionBadge Component
 *
 * Implements Badge Design Variant 13 (Filled Solid) as the global standard
 * for section eyebrow badges across GharPadharo Careers.
 *
 * Design Specifications:
 * - Background: #5929D6
 * - Text: #FFFFFF
 * - Border radius: 9999px (rounded-full)
 * - Typography: uppercase, font-semibold
 * - Letter spacing: 0.05em (tracking-wider)
 * - Font size: text-xs sm:text-[12.5px]
 * - Layout: inline-flex items-center justify-center leading-none select-none
 * - Padding: px-4 py-1.5
 * - Clean solid fill: no gradients, icons, decorative dots, borders, or shadows.
 */
export default function SectionBadge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center bg-[#5929D6] text-white text-xs sm:text-[12.5px] font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full leading-none select-none ${className}`.trim()}
    >
      {children}
    </span>
  );
}
