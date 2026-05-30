"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  token: string;
}

export function QRCodeDisplay({ token }: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white p-8">
      <QRCodeSVG value={token} size={200} />
      <p className="text-sm text-stone-500">Scan at smart locker</p>
    </div>
  );
}
