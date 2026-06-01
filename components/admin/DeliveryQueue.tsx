"use client";

import { useState } from "react";
import { MapPin, Package, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignDelivery } from "@/actions/deliveries";

interface DeliveryItem {
  id: string;
  customerName: string;
  address: string;
  items: string;
}

interface DeliveryQueueProps {
  queue: DeliveryItem[];
  loading?: boolean;
  onAssigned?: () => void;
}

interface AssignmentForm {
  vehicleType: string;
  driverName: string;
}

export function DeliveryQueue({ queue, loading = false, onAssigned }: DeliveryQueueProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<
    Record<string, AssignmentForm>
  >({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
    if (!assignments[id]) {
      setAssignments((prev) => ({
        ...prev,
        [id]: { vehicleType: "truck", driverName: "" },
      }));
    }
  }

  function updateAssignment(
    id: string,
    field: keyof AssignmentForm,
    value: string
  ) {
    setAssignments((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  async function handleAssign(orderId: string) {
    const form = assignments[orderId];
    if (!form?.driverName.trim()) return;

    setSubmitting(orderId);
    try {
      const result = await assignDelivery(orderId, form.vehicleType, form.driverName);
      if (result.success) {
        setExpandedId(null);
        onAssigned?.();
      }
    } finally {
      setSubmitting(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-100 bg-white p-12 text-center text-sm text-stone-400">
        Loading unassigned orders...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {queue.map((item) => {
        const isExpanded = expandedId === item.id;
        const form = assignments[item.id] ?? {
          vehicleType: "truck",
          driverName: "",
        };

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-stone-100 bg-white"
          >
            <button
              onClick={() => toggleExpand(item.id)}
              className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-stone-50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-stone-900">
                    {item.id.slice(0, 8)}
                  </span>
                  <span className="text-sm text-stone-700">
                    {item.customerName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <MapPin className="size-3.5" />
                  {item.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Package className="size-3.5" />
                  {item.items}
                </div>
              </div>
              <div className="shrink-0 pl-4">
                {isExpanded ? (
                  <ChevronUp className="size-5 text-stone-400" />
                ) : (
                  <ChevronDown className="size-5 text-stone-400" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-stone-100 px-5 pb-5 pt-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">Vehicle Type</Label>
                    <Select
                      value={form.vehicleType}
                      onValueChange={(val) =>
                        val !== null && val !== undefined && updateAssignment(item.id, "vehicleType", val)
                      }
                    >
                      <SelectTrigger className="w-full sm:w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="drone">Drone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">Driver Name</Label>
                    <Input
                      value={form.driverName}
                      onChange={(e) =>
                        updateAssignment(
                          item.id,
                          "driverName",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Carlos R."
                      className="h-9"
                    />
                  </div>
                  <Button
                    onClick={() => handleAssign(item.id)}
                    disabled={!form.driverName.trim() || submitting === item.id}
                    className="h-9 shrink-0 bg-green-600 text-white hover:bg-green-700"
                  >
                    {submitting === item.id ? "Assigning..." : "Assign"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {queue.length === 0 && (
        <div className="rounded-2xl border border-stone-100 bg-white p-12 text-center text-sm text-stone-400">
          No unassigned orders in the queue.
        </div>
      )}
    </div>
  );
}
