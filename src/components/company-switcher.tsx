"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building } from "lucide-react";

export function CompanySwitcher() {
  return (
    <Select defaultValue="acme-inc">
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <SelectValue placeholder="Select a company" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="acme-inc">Acme Inc.</SelectItem>
        <SelectItem value="globex-corp">Globex Corporation</SelectItem>
        <SelectItem value="stark-industries">Stark Industries</SelectItem>
      </SelectContent>
    </Select>
  );
}
