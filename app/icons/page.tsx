"use client";

import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react"; // Import all icons
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface IconData {
  name: string;
  size: number;
  position: string;
}

export default function DynamicIconsComponent() {
  const [icons, setIcons] = useState<IconData[]>([]);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch("/api/icons");
        const data = await response.json();
        setIcons(data.icons);
      } catch (error) {
        console.error("Error fetching icons:", error);
      }
    };

    fetchIcons();
  }, []);

  return (
    <div>
      {icons.map((icon, index) => {
        const LucideIcon = (LucideIcons as any)[icon.name]; // Get the icon dynamically

        if (!LucideIcon) return null; // Skip if icon is invalid

        return (
          <div key={index} className="mb-6">
            <Label className="mb-4">{icon.name}</Label>
            <div className="relative">
              <Input type="text" placeholder={`Enter ${icon.name}`} className="pl-12 h-16" />
              <LucideIcon className={`absolute ${icon.position} text-color-E9E3D7 pointer-events-none`} size={icon.size} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
