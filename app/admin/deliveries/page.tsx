import { DeliveryQueue } from "@/components/admin/DeliveryQueue";

export default function DeliveriesPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-stone-900">Delivery Queue</h1>
        <p className="mt-1 text-sm text-stone-500">
          Assign and manage unconfirmed deliveries.
        </p>
      </div>

      <DeliveryQueue />
    </div>
  );
}
