"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AddressFormProps {
  value: Address;
  onChange: (address: Address) => void;
}

export function AddressForm({ value, onChange }: AddressFormProps) {
  const update = (field: keyof Address, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          placeholder="123 Farm Lane"
          value={value.street}
          onChange={(e) => update("street", e.target.value)}
          autoComplete="street-address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Springfield"
            value={value.city}
            onChange={(e) => update("city", e.target.value)}
            autoComplete="address-level2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="CA"
            value={value.state}
            onChange={(e) => update("state", e.target.value)}
            autoComplete="address-level1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input
          id="zipCode"
          placeholder="90210"
          value={value.zipCode}
          onChange={(e) => update("zipCode", e.target.value)}
          autoComplete="postal-code"
          className="w-1/2"
        />
      </div>
    </div>
  );
}
