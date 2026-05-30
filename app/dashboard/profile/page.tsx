"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockProfile = {
  full_name: "John Smith",
  email: "john@example.com",
  phone: "(555) 123-4567",
  address: "123 Farm Lane, Freshville, CA 90210",
};

export default function ProfilePage() {
  const [fullName, setFullName] = useState(mockProfile.full_name);
  const [phone, setPhone] = useState(mockProfile.phone);
  const [address, setAddress] = useState(mockProfile.address);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Profile updated successfully");
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-light text-stone-900">Profile</h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage your account information.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl border border-stone-100 bg-white p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={mockProfile.email}
            readOnly
            disabled
            className="opacity-60"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 000-0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Default Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, City, State ZIP"
          />
        </div>

        <div className="pt-2">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
