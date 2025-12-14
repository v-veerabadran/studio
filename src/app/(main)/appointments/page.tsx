
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Evelyn Reed",
    specialty: "Cardiology",
    date: "2024-08-15",
    time: "10:30 AM",
    location: "Westside Medical Center, Suite 201",
  },
  {
    id: 2,
    doctor: "Dr. Ben Carter",
    specialty: "Dermatology",
    date: "2024-08-22",
    time: "02:00 PM",
    location: "Downtown Health Clinic",
  },
];

const pastAppointments = [
    {
        id: 3,
        doctor: "Dr. Olivia Chen",
        specialty: "General Practice",
        date: "2024-05-10",
        time: "09:00 AM",
        notes: "Annual physical exam. All results normal."
    },
    {
        id: 4,
        doctor: "Dr. Ben Carter",
        specialty: "Dermatology",
        date: "2024-03-18",
        time: "11:00 AM",
        notes: "Follow-up for skin rash. Condition has improved."
    }
]

export default function AppointmentsPage() {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    }
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Button>Book New Appointment</Button>
      </div>
      
      <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {upcomingAppointments.length > 0 ? upcomingAppointments.map(appt => (
                     <div key={appt.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <p className="font-bold">{formatDate(appt.date)} at {appt.time}</p>
                            <p className="text-muted-foreground">{appt.doctor} - {appt.specialty}</p>
                            <p className="text-sm text-muted-foreground">{appt.location}</p>
                        </div>
                        <div className="flex gap-2 mt-4 sm:mt-0">
                            <Button variant="outline">Reschedule</Button>
                            <Button variant="destructive">Cancel</Button>
                        </div>
                    </div>
                )) : (
                    <p className="text-muted-foreground">You have no upcoming appointments.</p>
                )}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Past Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {pastAppointments.map(appt => (
                    <div key={appt.id} className="p-4 border rounded-lg">
                        <p className="font-bold">{formatDate(appt.date)}</p>
                        <p className="text-muted-foreground">{appt.doctor} - {appt.specialty}</p>
                        {appt.notes && <p className="text-sm mt-2">Notes: {appt.notes}</p>}
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
