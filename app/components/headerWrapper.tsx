"use client";

import { usePathname } from "next/navigation";
import Header from "./Header/Header";

export default function HeaderWrapper() {
    const pathname = usePathname();
    const hideHeader = pathname === "/reservation" || pathname === "/walk-in" || pathname === "/login"

    if (hideHeader) return null;
    return <Header />;
}