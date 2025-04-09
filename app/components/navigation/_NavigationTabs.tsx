"use client";
import Link from "next/link";

import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import {
  BookOpen,
  Calendar,
  CalendarDays,
  ClipboardList,
  TableProperties,
} from "lucide-react";

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function NavigationTabs({
  activeTab,
  onTabChange,
}: NavigationTabsProps) {
  return (
    <div className="w-full flex items-center justify-between py-2 shadow-md">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
        <TabsList className="bg-transparent h-11">
          <TabsTrigger
            value="floorplan"
            className="text-amber-400 hover:text-amber-300 data-[state=active]:text-amber-400 data-[state=active]:bg-[#302c3d] data-[state=active]:shadow-none px-4"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Floorplan
          </TabsTrigger>
          <Link
            href="/table-combination"
            className="text-amber-400 hover:text-amber-300 px-4 flex items-center"
          >
            <TableProperties className="mr-2 h-4 w-4" />
            Table Combinations
          </Link>
          <TabsTrigger
            value="availability-settings"
            className="text-amber-400 hover:text-amber-300 data-[state=active]:text-amber-400 data-[state=active]:bg-[#302c3d] data-[state=active]:shadow-none px-4"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Availability Settings
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="text-amber-400 hover:text-amber-300 data-[state=active]:text-amber-400 data-[state=active]:bg-[#302c3d] data-[state=active]:shadow-none px-4"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger
            value="special-days"
            className="text-amber-400 hover:text-amber-300 data-[state=active]:text-amber-400 data-[state=active]:bg-[#302c3d] data-[state=active]:shadow-none px-4"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Special Days
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Button className="">Publish updates</Button>
    </div>
  );
}
