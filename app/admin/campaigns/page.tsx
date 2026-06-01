"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Plus, Tag, Percent, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Campaign {
  id: string;
  name: string;
  type: string;
  discount_pct: number | null;
  code: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const typeIcons: Record<string, React.ReactNode> = {
  promo: <Tag className="size-5" />,
  referral: <Users className="size-5" />,
  seasonal: <Sparkles className="size-5" />,
  loyalty: <Percent className="size-5" />,
};

const typeLabels: Record<string, string> = {
  promo: "Promo",
  referral: "Referral",
  seasonal: "Seasonal",
  loyalty: "Loyalty",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "promo",
    discount_pct: "",
    code: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("campaigns").insert({
      name: formData.name,
      description: formData.description || null,
      type: formData.type,
      discount_pct: formData.discount_pct ? parseFloat(formData.discount_pct) : null,
      code: formData.code || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      is_active: formData.is_active,
    });
    if (error) {
      alert("Failed to create campaign: " + error.message);
      setSubmitting(false);
    } else {
      setShowForm(false);
      setFormData({ name: "", description: "", type: "promo", discount_pct: "", code: "", start_date: "", end_date: "", is_active: true });
      const { data } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
      setCampaigns(data || []);
      setSubmitting(false);
    }
  }


  useEffect(() => {
    async function fetchCampaigns() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) {
        console.error("Failed to fetch campaigns:", error);
        setLoading(false);
        return;
      }

      setCampaigns(
        data.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          discount_pct: c.discount_pct,
          code: c.code,
          start_date: c.start_date,
          end_date: c.end_date,
          is_active: c.is_active,
        }))
      );
      setLoading(false);
    }

    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-stone-900">Campaigns</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage marketing and engagement campaigns.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white hover:bg-green-700">
          <Plus className="size-4" />
          Create Campaign
        </Button>
      </div>

      {/* Create Campaign Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 rounded-2xl border border-stone-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-stone-900">New Campaign</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-stone-700">Name *</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" placeholder="e.g. Spring Egg Sale 2026" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
              <input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" placeholder="Optional description" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Type *</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm">
                <option value="promo">Promo</option>
                <option value="referral">Referral</option>
                <option value="seasonal">Seasonal</option>
                <option value="loyalty">Loyalty</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Discount %</label>
              <input type="number" min="0" max="100" value={formData.discount_pct} onChange={(e) => setFormData({...formData, discount_pct: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" placeholder="0-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Promo Code</label>
              <input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" placeholder="e.g. FRESH10" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Active</label>
              <select value={formData.is_active ? 'true' : 'false'} onChange={(e) => setFormData({...formData, is_active: e.target.value === 'true'})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Start Date</label>
              <input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">End Date</label>
              <input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit" disabled={submitting} className="bg-green-600 text-white hover:bg-green-700">
              {submitting ? "Creating..." : "Create Campaign"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-2xl border border-stone-100 bg-white p-12 text-center text-sm text-stone-400">
          Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-stone-100 bg-white p-12 text-center text-sm text-stone-400">
          No campaigns yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-2xl border border-stone-100 bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                    {typeIcons[campaign.type] ?? <Tag className="size-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">
                      {campaign.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {typeLabels[campaign.type] ?? campaign.type}
                      {campaign.discount_pct
                        ? ` • ${campaign.discount_pct}% off`
                        : ""}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    campaign.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-stone-100 text-stone-500"
                  )}
                >
                  {campaign.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {campaign.code && (
                <p className="mt-3 text-xs text-stone-500">
                  Code: <span className="font-mono font-medium text-stone-700">{campaign.code}</span>
                </p>
              )}

              <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
                <span>Start: {formatDate(campaign.start_date)}</span>
                <span>End: {formatDate(campaign.end_date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
