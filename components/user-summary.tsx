import { BadgeCheck, Clock3 } from "lucide-react";
import { AppUser } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function UserSummary({ user }: { user: AppUser }) {
  return (
    <Card className="flex flex-col gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Signed in</p>
        <h3 className="text-lg font-semibold">{user.name}</h3>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2 py-1">
          <BadgeCheck className="h-3.5 w-3.5 text-[var(--gold)]" />
          Role: {user.role}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2 py-1">
          <Clock3 className="h-3.5 w-3.5 text-[var(--gold)]" />
          Membership: {user.membershipStatus}
        </span>
      </div>
    </Card>
  );
}