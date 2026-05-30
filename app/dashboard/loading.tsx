import { DashboardSkeleton } from "@/components/shared/LoadingSkeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <DashboardSkeleton />
    </div>
  );
}
