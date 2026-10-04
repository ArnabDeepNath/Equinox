import Image from "next/image";
import Link from "next/link";

const FOOTER_COLUMNS: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Product",
    links: [
      { label: "Venues", href: "/venues" },
      { label: "Book Slots", href: "/book" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Sports",
    links: [
      { label: "Paddle", href: "/book" },
      { label: "Football Turf", href: "/book" },
      { label: "Table Tennis", href: "/book" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Equinox", href: "/venues" },
      { label: "Player Lounge", href: "/community" },
      { label: "Partner / Admin", href: "/admin" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cancellation Policy", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#141414] bg-[#050505] text-sm text-[#A1A1A1]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/equinox-mark.svg"
                alt="Equinox Brand Mark"
                width={36}
                height={36}
                className="h-9 w-9 object-contain drop-shadow-[0_0_12px_rgba(229,193,88,0.4)]"
              />
              <span className="flex flex-col">
                <span className="text-lg font-bold uppercase leading-none tracking-[0.2em] text-white">
                  Equinox
                </span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E5C158]">
                  The Sports Commune
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-xs leading-relaxed text-[#8A8A8A]">
              Premium courts, honest pricing, instant confirmation.
              Guwahati&rsquo;s home for paddle, football turf, and table tennis.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                  {column.title}
                </p>
                <ul className="space-y-2.5 text-xs">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-[#E5C158]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#141414] pt-8 text-xs">
          <p>
            © {new Date().getFullYear()} Equinox Sports Inc. All rights
            reserved.
          </p>
          <p className="text-[#8A8A8A]">
            Next.js App Router · Firebase · PWA Ready
          </p>
        </div>
      </div>
    </footer>
  );
}
