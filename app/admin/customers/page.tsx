import { Mail, User } from "lucide-react";

const customers = [
  {
    name: "Sarah Mitchell",
    email: "sarah.m@example.com",
    ordersCount: 12,
    joinedDate: "Jan 15, 2026",
  },
  {
    name: "James Park",
    email: "j.park@example.com",
    ordersCount: 8,
    joinedDate: "Feb 3, 2026",
  },
  {
    name: "Maria Garcia",
    email: "m.garcia@example.com",
    ordersCount: 23,
    joinedDate: "Nov 22, 2025",
  },
  {
    name: "David Chen",
    email: "d.chen@example.com",
    ordersCount: 5,
    joinedDate: "Mar 18, 2026",
  },
  {
    name: "Emily Johnson",
    email: "emily.j@example.com",
    ordersCount: 17,
    joinedDate: "Dec 1, 2025",
  },
];

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-stone-900">Customers</h1>
        <p className="mt-1 text-sm text-stone-500">
          View and manage registered customers.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Orders</th>
              <th className="px-6 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {customers.map((customer) => (
              <tr
                key={customer.email}
                className="transition-colors hover:bg-stone-50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <User className="size-4" />
                    </div>
                    <span className="text-sm font-medium text-stone-900">
                      {customer.name}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Mail className="size-3.5 text-stone-400" />
                    {customer.email}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-700">
                  {customer.ordersCount}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                  {customer.joinedDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
