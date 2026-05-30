"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock recurring delivery days (day-of-month)
const DELIVERY_DAYS = [3, 10, 17, 24];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SchedulePage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const firstDayOfWeek = useMemo(() => getFirstDayOfWeek(year, month), [year, month]);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  // Empty leading cells
  const leadingCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const isDeliveryDay = (day: number) => DELIVERY_DAYS.includes(day);
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-light text-stone-900">Delivery Schedule</h1>
        <p className="mt-1 text-sm text-stone-500">
          Your recurring delivery dates are shown below.
        </p>
      </div>

      {/* Calendar card */}
      <div className="rounded-2xl border border-stone-100 bg-white p-6">
        {/* Month header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-medium text-stone-900">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-xs font-medium text-stone-400 py-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty leading cells */}
          {leadingCells.map((i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <div
              key={day}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl text-sm",
                isToday(day) &&
                  "font-semibold text-stone-900 ring-2 ring-terra-400",
                isDeliveryDay(day) &&
                  !isToday(day) &&
                  "bg-green-50 text-green-700 font-medium",
                !isDeliveryDay(day) &&
                  !isToday(day) &&
                  "text-stone-700"
              )}
              title={isDeliveryDay(day) ? "Scheduled delivery" : undefined}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-green-50" />
            Delivery day
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full ring-2 ring-terra-400" />
            Today
          </span>
        </div>
      </div>
    </div>
  );
}
