export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-[var(--gold-soft)] sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-[var(--muted-foreground)]">{subtitle}</p> : null}
    </div>
  );
}