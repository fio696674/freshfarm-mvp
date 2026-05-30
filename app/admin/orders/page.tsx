import { OrderTable } from "@/components/admin/OrderTable";

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-stone-900">
          Order Management
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          View and manage all customer orders.
        </p>
      </div>

      <OrderTable />
    </div>
  );
}
