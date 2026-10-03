import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-black px-4 py-8 text-center text-xs text-[var(--muted-foreground)]">
      <div className="mb-4 flex justify-center">
        <Image
          src="/equinox-logo.svg"
          alt="Equinox — The Sports Commune"
          width={150}
          height={126}
          className="w-[150px] h-auto rounded-lg opacity-90"
        />
      </div>
      © {new Date().getFullYear()} Equinox Sports. Premium game booking platform.
    </footer>
  );
}