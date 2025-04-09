"use client";
import TableCombinations from "@/app/components/tabs/TableCombinations";
import Navigation from "../components/navigation/Navigation";

export default function TableCombinationPage() {
  return (
    <div className="flex flex-col bg-color-121020 p-6">
      <Navigation />
      <TableCombinations />
    </div>
  );
}
