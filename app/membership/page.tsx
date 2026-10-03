export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getMembershipRequests } from "@/lib/store";
import { MembershipForm } from "@/components/membership-form";

export default async function MembershipPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/membership");
  }

  const requests = await getMembershipRequests();
  const existingPending = requests.find(
    (r) => r.userId === user.id && r.status === "pending"
  );

  return (
    <div className="min-h-screen bg-[#060606] text-white py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <span className="text-xs uppercase font-bold tracking-wider text-[#E5C158]">
            Player Tier Upgrade
          </span>
          <h1 className="text-3xl font-bold text-white mt-1">Apply for Equinox Membership</h1>
          <p className="text-sm text-[#A1A1A1] mt-2">
            Approved members unlock prime morning & evening slots and receive up to 20% discount on every court reservation.
          </p>
        </div>

        <div className="rounded-[16px] bg-[#0D0D0D] border border-[#1A1813] p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1A1813] text-xs">
            <div>
              <span className="text-[#A1A1A1]">Current Status:</span>
              <p className="font-bold text-white uppercase mt-0.5">{user.membershipStatus}</p>
            </div>
            <div>
              <span className="text-[#A1A1A1]">Account Email:</span>
              <p className="font-mono text-white mt-0.5">{user.email}</p>
            </div>
          </div>

          {user.membershipStatus === "approved" ? (
            <div className="rounded-[10px] bg-[#E5C158]/10 border border-[#E5C158]/30 p-4 text-[#E5C158] text-xs">
              You are an active approved member. You already have priority access to all member-exclusive slots and automated discounts.
            </div>
          ) : existingPending ? (
            <div className="rounded-[10px] bg-[#E5C158]/10 border border-[#E5C158]/30 p-4 text-[#E5C158] text-xs">
              Your membership application is currently under admin review. You will be notified once processed.
            </div>
          ) : (
            <MembershipForm />
          )}
        </div>
      </div>
    </div>
  );
}
