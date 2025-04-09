import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    icons: [
      { name: "Calendar", size: 18, position: "right-4 top-3.5" },
      { name: "NotebookTabs", size: 32, position: "left-3 top-[calc(50%-16px)]" }
    ]
  });
}
