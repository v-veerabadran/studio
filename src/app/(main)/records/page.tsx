
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function RecordsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Medical Records</h1>
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
          <CardDescription>View and manage your uploaded documents.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">You haven't uploaded any documents yet.</p>
                <Button variant="link" className="mt-2">Upload a document</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
