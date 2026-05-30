"use client";

import { Camera, Heart, Upload } from "lucide-react";
import { useState } from "react";

interface GalleryItem {
  id: string;
  caption: string;
  likes: number;
  color: string;
}

const MOCK_GALLERY: GalleryItem[] = [
  { id: "1", caption: "Fresh eggs from the morning!", likes: 24, color: "from-amber-200 to-orange-200" },
  { id: "2", caption: "My breakfast spread 🍳", likes: 18, color: "from-yellow-200 to-amber-200" },
  { id: "3", caption: "Look at these beauties", likes: 31, color: "from-orange-200 to-red-200" },
  { id: "4", caption: "Farm-to-table freshness", likes: 12, color: "from-green-200 to-emerald-200" },
  { id: "5", caption: "Egg carton art!", likes: 7, color: "from-rose-200 to-pink-200" },
  { id: "6", caption: "Sunday baking prep", likes: 15, color: "from-violet-200 to-purple-200" },
];

export default function UGCPage() {
  const [caption, setCaption] = useState("");
  const [gallery, setGallery] = useState(MOCK_GALLERY);

  function handleLike(id: string) {
    setGallery((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Community Gallery</h1>
        <p className="mt-2 text-stone-500">
          Share your fresh egg moments with the FreshFarm community
        </p>
      </div>

      {/* Upload form (demo / non-functional) */}
      <div className="mb-10 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-stone-800">
          Share a Photo
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-8 text-sm text-stone-500 transition-colors hover:border-amber-400 hover:bg-amber-50/50">
            <Upload className="h-5 w-5" />
            Choose a photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={() => {
                /* non-functional for demo */
              }}
            />
          </label>
        </div>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          className="mt-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
        <button
          disabled
          className="mt-4 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white opacity-60"
        >
          Upload
        </button>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-stone-100 bg-white transition-shadow hover:shadow-md"
          >
            {/* Colored placeholder with camera icon */}
            <div
              className={`flex aspect-square items-center justify-center bg-gradient-to-br ${item.color}`}
            >
              <Camera className="h-12 w-12 text-white/70 transition-transform group-hover:scale-110" />
            </div>

            {/* Caption and like */}
            <div className="p-3">
              <p className="line-clamp-2 text-sm text-stone-700">
                {item.caption}
              </p>
              <button
                onClick={() => handleLike(item.id)}
                className="mt-2 inline-flex items-center gap-1 text-xs text-stone-400 transition-colors hover:text-rose-500"
              >
                <Heart className="h-3.5 w-3.5" />
                {item.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
