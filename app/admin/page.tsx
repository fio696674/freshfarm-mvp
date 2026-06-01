import { MetricsCards } from "@/components/admin/MetricsCards";

// Fallback data for when Supabase is not available
const recentOrders: any[] = [];

const statusDotColor: Record<string, string> = {
  Pending: "bg-amber-400",
  Confirmed: "bg-blue-400",
  "In Transit": "bg-violet-400",
  Delivered: "bg-green-500",
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-stone-900">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Overview of your FreshFarm operations.
        </p>
      </div>

      <MetricsCards />

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-stone-900">
          Recent Orders
        </h2>
        <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-stone-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-stone-900">
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
                    {order.customer}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <span
                        className={`size-2 rounded-full ${statusDotColor[order.status]}`}
                      />
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-stone-900">
                    {order.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
