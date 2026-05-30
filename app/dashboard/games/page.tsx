import { EggHatchGame } from "@/components/games/EggHatchGame";

export default function GamesPage() {
  return (
    <div className="relative min-h-[80vh]">
      {/* Subtle farm-themed background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-yellow-50/60" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-50/30 to-transparent" />
      </div>

      <div className="relative">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-stone-900">Great Eggscape</h1>
          <p className="mt-2 text-stone-500">
            Hatch an egg and unlock a surprise discount!
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <EggHatchGame />
        </div>
      </div>
    </div>
  );
}
