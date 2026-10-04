interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * Infinite scrolling ticker strip (Aurelston-style). The track renders the
 * item list twice; the CSS animation translates it by -50% for a seamless
 * loop. Pauses on hover, disabled under prefers-reduced-motion.
 */
export function Marquee({ items, className = "" }: MarqueeProps) {
  const sequence = [...items, ...items];

  return (
    <div
      className={`relative overflow-hidden border-y border-[#1A1813] bg-[#080807] py-4 ${className}`}
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        {sequence.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center text-xs font-semibold uppercase tracking-[0.35em] text-[#A1A1A1]"
          >
            <span className="px-6">{item}</span>
            <span className="text-[#E5C158]">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
