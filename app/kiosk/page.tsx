import { QRScanner } from "@/components/dashboard/QRScanner";

export default function KioskPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-stone-900">
            Kiosk Pickup Scanner
          </h1>
          <p className="mt-2 text-stone-500">
            Scan your order QR code to open the smart locker
          </p>
        </div>

        <QRScanner />

        <div className="mt-10 text-center text-xs text-stone-400">
          <p>FreshFarm Smart Locker System v1.0</p>
        </div>
      </div>
    </div>
  );
}
