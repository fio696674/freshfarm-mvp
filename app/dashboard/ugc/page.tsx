"use client";

import { Camera, Heart, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface GalleryItem {
  id: string;
  caption: string;
  image_url: string;
  profiles: { full_name: string | null } | null;
}

interface MockGalleryItem {
  id: string;
  caption: string;
  likes: number;
  color: string;
}

const MOCK_GALLERY: MockGalleryItem[] = [
  { id: "1", caption: "Fresh eggs from the morning!", likes: 24, color: "from-amber-200 to-orange-200" },
  { id: "2", caption: "My breakfast spread 🍳", likes: 18, color: "from-yellow-200 to-amber-200" },
  { id: "3", caption: "Look at these beauties", likes: 31, color: "from-orange-200 to-red-200" },
  { id: "4", caption: "Farm-to-table freshness", likes: 12, color: "from-green-200 to-emerald-200" },
  { id: "5", caption: "Egg carton art!", likes: 7, color: "from-rose-200 to-pink-200" },
  { id: "6", caption: "Sunday baking prep", likes: 15, color: "from-violet-200 to-purple-200" },
];

const GRADIENT_COLORS = [
  "from-amber-200 to-orange-200",
  "from-yellow-200 to-amber-200",
  "from-orange-200 to-red-200",
  "from-green-200 to-emerald-200",
  "from-rose-200 to-pink-200",
  "from-violet-200 to-purple-200",
];

export default function UGCPage() {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [approvedItems, setApprovedItems] = useState<GalleryItem[]>([]);
  const [mockLikes, setMockLikes] = useState(MOCK_GALLERY);
  const supabase = createClient();

  useEffect(() => {
    loadApprovedSubmissions();
  }, []);

  async function loadApprovedSubmissions() {
    try {
      const { data, error } = await supabase
        .from("ugc_submissions")
        .select("*, profiles(full_name)")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApprovedItems(data ?? []);
    } catch {
      // ugc_submissions table or bucket may not exist yet
      console.warn("Could not load UGC submissions. Ensure the ugc_submissions table exists in Supabase.");
    }
  }

  async function handleUpload() {
    if (!file || !caption.trim()) return;

    setUploading(true);
    setToast(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setToast({ message: "You must be logged in to upload.", type: "error" });
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("ugc")
        .upload(filePath, file);

      if (uploadError) {
        // Bucket may not exist - provide helpful message
        const msg = uploadError.message.includes("not found")
          ? 'Storage bucket "ugc" not found. Create it in the Supabase Dashboard > Storage.'
          : `Upload failed: ${uploadError.message}`;
        setToast({ message: msg, type: "error" });
        return;
      }

      const { data: urlData } = supabase.storage
        .from("ugc")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("ugc_submissions")
        .insert({
          user_id: user.id,
          image_url: urlData.publicUrl,
          caption: caption.trim(),
        });

      if (insertError) {
        setToast({ message: `Failed to save submission: ${insertError.message}`, type: "error" });
        return;
      }

      setToast({ message: "Photo uploaded successfully!", type: "success" });
      setCaption("");
      setFile(null);
      await loadApprovedSubmissions();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error during upload";
      setToast({ message, type: "error" });
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  }

  function handleMockLike(id: string) {
    setMockLikes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  }

  return (
    <div>
      {toast && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {toast.message}
          <button
            onClick={() => setToast(null)}
            className="ml-3 underline opacity-70 hover:opacity-100"
          >
            dismiss
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Community Gallery</h1>
        <p className="mt-2 text-stone-500">
          Share your fresh egg moments with the FreshFarm community
        </p>
      </div>

      {/* Upload form */}
      <div className="mb-10 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-stone-800">
          Share a Photo
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-8 text-sm text-stone-500 transition-colors hover:border-amber-400 hover:bg-amber-50/50">
            <Upload className="h-5 w-5" />
            {file ? file.name : "Choose a photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          rows={3}
          className="mt-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
        <button
          disabled={!file || !caption.trim() || uploading}
          onClick={handleUpload}
          className="mt-4 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Approved UGC from Supabase */}
      {approvedItems.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-stone-800">Approved Submissions</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {approvedItems.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-stone-100 bg-white transition-shadow hover:shadow-md"
              >
                <img
                  src={item.image_url}
                  alt={item.caption}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-3">
                  <p className="line-clamp-2 text-sm text-stone-700">{item.caption}</p>
                  {item.profiles?.full_name && (
                    <p className="mt-1 text-xs text-stone-400">by {item.profiles.full_name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mock gallery (fallback demo data) */}
      {approvedItems.length === 0 && (
        <>
          <h2 className="mb-4 text-lg font-semibold text-stone-800">Community Posts</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {mockLikes.map((item, i) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-stone-100 bg-white transition-shadow hover:shadow-md"
              >
                <div
                  className={`flex aspect-square items-center justify-center bg-gradient-to-br ${item.color}`}
                >
                  <Camera className="h-12 w-12 text-white/70 transition-transform group-hover:scale-110" />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm text-stone-700">
                    {item.caption}
                  </p>
                  <button
                    onClick={() => handleMockLike(item.id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-stone-400 transition-colors hover:text-rose-500"
                  >
                    <Heart className="h-3.5 w-3.5" />
                    {item.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
