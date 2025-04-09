
"use client";

import { Card } from '@/app/components/ui/card';

export default function Schedule() {
  return (
    <div className="flex-1 p-4">
      <Card className="p-6 w-full h-full flex items-center justify-center">
        <h2 className="text-xl font-semibold text-center">Schedule Content</h2>
        <p className="text-muted-foreground mt-2">This section will allow you to manage your schedule</p>
      </Card>
    </div>
  );
}
