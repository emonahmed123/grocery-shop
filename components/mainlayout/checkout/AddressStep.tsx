"use client";

import { Truck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/assets";
import { DIVISIONS, type District, getDeliveryFee, isInsideDhaka } from "@/lib/districts";
import { useAddress, useCheckoutActions, useDistrict } from "@/store/checkout.store";

const AddressStep = () => {
  const district = useDistrict();
  const address = useAddress();
  const { selectDistrict, updateAddress } = useCheckoutActions();

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <Label htmlFor="district">District</Label>
          <Select value={district ?? ""} onValueChange={(value) => selectDistrict(value as District)}>
            <SelectTrigger id="district" size="lg" className="w-full">
              <SelectValue placeholder="Select your district" />
            </SelectTrigger>
            <SelectContent position="popper">
              {DIVISIONS.map((division) => (
                <SelectGroup key={division.name}>
                  <SelectLabel>{division.name} Division</SelectLabel>
                  {division.districts.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2.5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(event) => updateAddress(event.target.value)}
            placeholder="House 12, Road 5, Dhanmondi"
            autoComplete="street-address"
            className="h-12"
          />
        </div>
      </div>

      {/* The delivery area follows the district, so there is nothing to pick by hand. */}
      {district && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="size-4 text-brand" aria-hidden="true" />
          <span>
            <span className="font-semibold text-foreground">
              {isInsideDhaka(district) ? "Inside Dhaka" : "Outside Dhaka"}
            </span>{" "}
            delivery: {formatPrice(getDeliveryFee(district))}
          </span>
        </p>
      )}
    </div>
  );
};

export default AddressStep;
