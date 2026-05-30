import { AdminDashboardSkeleton } from "@/components/shared/LoadingSkeleton";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <AdminDashboardSkeleton />
    </div>
  );
}
