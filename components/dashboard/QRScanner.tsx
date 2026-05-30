"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyKioskPickup } from "@/actions/kiosk";
import { cn } from "@/lib/utils";

type ScannerState = "idle" | "scanning" | "success" | "error";

export function QRScanner() {
  const [state, setState] = useState<ScannerState>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockerId, setLockerId] = useState("locker-1");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  async function startScanning() {
    if (!containerRef.current) return;

    setState("scanning");
    setErrorMessage(null);
    setResult(null);

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Stop scanning immediately after a successful scan
          if (scanner.isScanning) {
            await scanner.stop();
          }

          setResult(decodedText);

          try {
            const response = await verifyKioskPickup(decodedText, lockerId);
            if (response.success) {
              setState("success");
            } else {
              setErrorMessage(response.message);
              setState("error");
            }
          } catch {
            setErrorMessage("Failed to verify pickup. Please try again.");
            setState("error");
          }
        },
        () => {
          // QR code not found — ignore, keep scanning
        }
      );
    } catch (err) {
      console.error("Camera access failed:", err);
      setErrorMessage(
        "Camera access denied. Please allow camera permissions and try again."
      );
      setState("error");
    }
  }

  async function stopScanning() {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setState("idle");
    setResult(null);
    setErrorMessage(null);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Locker selector */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="locker-select"
          className="text-sm font-medium text-stone-600"
        >
          Locker:
        </label>
        <select
          id="locker-select"
          value={lockerId}
          onChange={(e) => setLockerId(e.target.value)}
          disabled={state === "scanning"}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
        >
          <option value="locker-1">Locker #1</option>
          <option value="locker-2">Locker #2</option>
          <option value="locker-3">Locker #3</option>
        </select>
      </div>

      {/* Scanner viewport */}
      <div className="relative w-full max-w-sm">
        <div
          id="qr-reader"
          ref={containerRef}
          className={cn(
            "overflow-hidden rounded-2xl border-2 transition-colors",
            state === "scanning"
              ? "border-amber-400"
              : "border-stone-200 bg-stone-50"
          )}
        />
        {state === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-stone-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
              />
            </svg>
            <p className="text-sm">Camera viewfinder will appear here</p>
          </div>
        )}
      </div>

      {/* Status messages */}
      {state === "success" && result && (
        <div className="w-full max-w-sm rounded-2xl border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-lg font-semibold text-green-700">
            Pickup Verified!
          </p>
          <p className="mt-1 text-sm text-green-600">
            Token: {result.slice(0, 16)}…
          </p>
          <p className="text-xs text-green-500">
            Locker {lockerId} has been opened.
          </p>
        </div>
      )}

      {state === "error" && errorMessage && (
        <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-lg font-semibold text-red-700">Verification Failed</p>
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {state === "idle" || state === "error" ? (
          <button
            onClick={startScanning}
            className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 active:bg-amber-700"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="rounded-xl bg-stone-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-stone-600 active:bg-stone-700"
          >
            Stop Scanning
          </button>
        )}

        {(state === "success" || state === "error") && (
          <button
            onClick={() => {
              setState("idle");
              setResult(null);
              setErrorMessage(null);
            }}
            className="rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
          >
            Scan Another
          </button>
        )}
      </div>
    </div>
  );
}
