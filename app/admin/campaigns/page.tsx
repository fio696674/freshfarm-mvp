import { Plus, Gamepad2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  active: boolean;
  icon: React.ReactNode;
}

const campaigns: Campaign[] = [
  {
    id: "camp-1",
    name: "Great Eggscape Spring 2026",
    type: "reward_game",
    startDate: "Mar 1, 2026",
    endDate: "May 31, 2026",
    active: true,
    icon: <Gamepad2 className="size-5" />,
  },
  {
    id: "camp-2",
    name: "UGC Photo Contest",
    type: "ugc_contest",
    startDate: "Apr 15, 2026",
    endDate: "Jun 15, 2026",
    active: true,
    icon: <Camera className="size-5" />,
  },
];

const typeLabels: Record<string, string> = {
  reward_game: "Reward Game",
  ugc_contest: "UGC Contest",
};

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-stone-900">Campaigns</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage marketing and engagement campaigns.
          </p>
        </div>
        <Button className="bg-green-600 text-white hover:bg-green-700">
          <Plus className="size-4" />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="rounded-2xl border border-stone-100 bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                  {campaign.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    {campaign.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {typeLabels[campaign.type]}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  campaign.active
                    ? "bg-green-100 text-green-700"
                    : "bg-stone-100 text-stone-500"
                )}
              >
                {campaign.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
              <span>Start: {campaign.startDate}</span>
              <span>End: {campaign.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
