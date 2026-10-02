export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-black px-4 py-6 text-center text-xs text-[var(--muted-foreground)]">
      © {new Date().getFullYear()} Equinox Sports. Premium game booking platform.
    </footer>
  );
}