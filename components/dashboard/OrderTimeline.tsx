import { cn } from "@/lib/utils";

const TIMELINE_STEPS = [
  "pending",
  "confirmed",
  "assigned",
  "in_transit",
  "delivered",
] as const;

type TimelineStep = (typeof TIMELINE_STEPS)[number];

interface TimelineEntry {
  step: TimelineStep;
  completed_at: string | null;
}

interface OrderTimelineProps {
  currentStatus: TimelineStep;
  timeline: TimelineEntry[];
}

export function OrderTimeline({ currentStatus, timeline }: OrderTimelineProps) {
  const activeIndex = TIMELINE_STEPS.indexOf(currentStatus);

  return (
    <ol className="relative ml-2 space-y-0 border-l-2 border-stone-200 pl-8">
      {TIMELINE_STEPS.map((step, index) => {
        const entry = timeline.find((t) => t.step === step);
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        const isFuture = index > activeIndex;

        return (
          <li key={step} className="relative pb-8 last:pb-0">
            {/* Connector dot */}
            <span
              className={cn(
                "absolute -left-[25px] top-0.5 h-3 w-3 rounded-full border-2 border-white",
                isCompleted || isActive ? "bg-green-500" : "bg-stone-300"
              )}
            />

            {/* Step label */}
            <p
              className={cn(
                "text-sm capitalize",
                isFuture ? "text-stone-400" : "text-stone-900",
                isActive && "font-semibold"
              )}
            >
              {step.replace(/_/g, " ")}
            </p>

            {/* Timestamp */}
            {entry?.completed_at && (
              <p className="mt-0.5 text-xs text-stone-500">
                {entry.completed_at}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
