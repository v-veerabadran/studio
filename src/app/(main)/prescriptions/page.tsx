
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";

const activePrescriptions = [
  {
    id: 1,
    medication: "Lisinopril",
    dosage: "10mg",
    instructions: "Take one tablet daily in the morning.",
    doctor: "Dr. Evelyn Reed",
    refillsLeft: 2,
    status: "Active"
  },
  {
    id: 2,
    medication: "Tretinoin Cream",
    dosage: "0.05%",
    instructions: "Apply a pea-sized amount to the face at night.",
    doctor: "Dr. Ben Carter",
    refillsLeft: 5,
    status: "Active"
  }
];

const pastPrescriptions = [
    {
    id: 3,
    medication: "Amoxicillin",
    dosage: "500mg",
    instructions: "Take one capsule every 8 hours for 7 days.",
    doctor: "Dr. Olivia Chen",
    refillsLeft: 0,
    status: "Expired"
  },
]

export default function PrescriptionsPage() {
  return (
    <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Prescriptions</h1>
            <Button>Request Refill</Button>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Active Prescriptions</CardTitle>
                    <CardDescription>These are your current medications. You can request refills here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Dosage</TableHead>
                                <TableHead>Prescribing Doctor</TableHead>
                                <TableHead className="text-center">Refills Left</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activePrescriptions.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.medication}</TableCell>
                                    <TableCell>{p.dosage}</TableCell>
                                    <TableCell>{p.doctor}</TableCell>
                                    <TableCell className="text-center">{p.refillsLeft}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" disabled={p.refillsLeft === 0}>Refill</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Past Prescriptions</CardTitle>
                    <CardDescription>This is your medication history.</CardDescription>
                </CardHeader>
                <CardContent>
                     {pastPrescriptions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Medication</TableHead>
                                    <TableHead>Dosage</TableHead>
                                    <TableHead>Prescribing Doctor</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pastPrescriptions.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.medication}</TableCell>
                                        <TableCell>{p.dosage}</TableCell>
                                        <TableCell>{p.doctor}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline">{p.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                     ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                            <Pill className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Your prescription history is empty.</p>
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>

    </div>
  );
}
