
"use client";

import { useUser } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, MessageSquare, Pill, Stethoscope, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { pageStyles } from "@/lib/page-styles";

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

const healthOffers = [
    {
        id: 1,
        title: "Free Annual Health Check-up",
        description: "Book your annual health check-up this month at no cost. Prevention is the best cure!",
        imageUrl: "https://picsum.photos/seed/health-check/600/400",
        imageHint: "health checkup"
    },
    {
        id: 2,
        title: "Nutrition & Wellness Seminar",
        description: "Join our free online seminar on building healthy eating habits. Register now!",
        imageUrl: "https://picsum.photos/seed/wellness-seminar/600/400",
        imageHint: "healthy food"
    }
]

export default function DashboardPage() {
  const { user } = useUser();
  const styles = pageStyles.dashboard;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
  }

  return (
    <div className={`container py-8 ${styles.backgroundColor}`}>
       <h1 className={`text-3xl font-bold mb-2 ${styles.primaryTextColor}`}>
          Welcome back, {user?.displayName?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground mb-8">
          Here's a summary of your health dashboard. Stay healthy!
        </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/appointments">
          <Card className="hover:bg-accent hover:cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                Check your schedule
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/records">
          <Card className="hover:bg-accent hover:cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Medical Records
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View</div>
              <p className="text-xs text-muted-foreground">
                Access your complete history
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/messages">
          <Card className="hover:bg-accent hover:cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 Unread</div>
              <p className="text-xs text-muted-foreground">
                From your care team
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/prescriptions">
          <Card className="hover:bg-accent hover:cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 Active</div>
              <p className="text-xs text-muted-foreground">
                Ready for refill
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
            <Card>
                <CardContent className="p-6 space-y-6">
                    {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map(appt => (
                            <div key={appt.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg">
                                <div className="flex-shrink-0">
                                    <div className="text-center">
                                        <p className="text-lg font-bold">{new Date(appt.date + 'T00:00:00').getDate()}</p>
                                        <p className="text-sm uppercase">{new Date(appt.date + 'T00:00:00').toLocaleString('default', { month: 'short' })}</p>
                                    </div>
                                </div>
                                <div className="border-l pl-4 flex-grow">
                                    <p className="font-bold text-lg">{appt.time}</p>
                                    <p className="text-muted-foreground">{formatDate(appt.date)}</p>
                                    <div className="mt-2 space-y-1 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="h-4 w-4 text-primary" />
                                            <span>{appt.doctor} ({appt.specialty})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span>{appt.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="mt-4 sm:mt-0">
                                    Details
                                </Button>
                            </div>
                        ))
                    ) : (
                         <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                            <Calendar className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">You have no upcoming appointments.</p>
                            <Button variant="link" className="mt-2">Book an Appointment</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        <div>
            <h2 className="text-2xl font-bold mb-4">Health Offers & News</h2>
            <div className="space-y-6">
                {healthOffers.map(offer => (
                    <Card key={offer.id} className="overflow-hidden">
                       <div className="relative h-40 w-full">
                         <Image src={offer.imageUrl} alt={offer.title} fill objectFit="cover" data-ai-hint={offer.imageHint} />
                       </div>
                       <CardHeader>
                            <CardTitle>{offer.title}</CardTitle>
                       </CardHeader>
                       <CardContent>
                            <CardDescription>{offer.description}</CardDescription>
                       </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
