
"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { allDoctors, type Doctor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Link from 'next/link';
import { ExternalLink, Clock, Calendar as CalendarIcon, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

function BookAppointmentPageContent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>();

    useEffect(() => {
        const doctorId = searchParams.get('doctorId');
        if (doctorId) {
            const foundDoctor = allDoctors.find(d => d.id === parseInt(doctorId));
            setDoctor(foundDoctor || null);
        } else {
            // Default to the first doctor if none is selected
            setDoctor(allDoctors[0]);
        }
    }, [searchParams]);

    const availableTimes = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    ];

    const handleBooking = () => {
        if (!selectedDate || !selectedTime || !doctor) {
            toast({
                title: "Incomplete Information",
                description: "Please select a date and time for your appointment.",
                variant: "destructive",
            });
            return;
        }

        const [time, modifier] = selectedTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours < 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }

        const appointmentDateTime = new Date(selectedDate);
        appointmentDateTime.setHours(hours, minutes, 0, 0);

        const eventStart = appointmentDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
        const eventEnd = new Date(appointmentDateTime.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '');

        const calendarUrl = new URL('https://www.google.com/calendar/render');
        calendarUrl.searchParams.append('action', 'TEMPLATE');
        calendarUrl.searchParams.append('text', `Appointment with ${doctor.name}`);
        calendarUrl.searchParams.append('dates', `${eventStart}/${eventEnd}`);
        calendarUrl.searchParams.append('details', `Doctor: ${doctor.name}, ${doctor.specialty}\nLocation: ${doctor.hospital}`);
        calendarUrl.searchParams.append('location', doctor.hospital);

        toast({
            title: "Appointment Confirmed",
            description: `Your appointment with ${doctor.name} is set for ${format(selectedDate, "PPP")} at ${selectedTime}.`,
            action: (
                <Button asChild variant="secondary" size="sm">
                    <Link href={calendarUrl.toString()} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Add to Google Calendar
                    </Link>
                </Button>
            ),
            duration: 10000,
        });
    }

    if (!doctor) {
        return (
             <div className="container py-8">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Doctor not found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Please select a doctor to book an appointment.</p>
                        <Button asChild className="mt-4">
                            <Link href="/doctors">Find a Doctor</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="container py-8">
             <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Doctor Info */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader className="items-center text-center">
                             <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint={doctor.imageHint} />
                                <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{doctor.name}</CardTitle>
                            <CardDescription>{doctor.specialty}</CardDescription>
                            <CardDescription>{doctor.hospital}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Separator />
                            <div className="text-sm text-muted-foreground space-y-4 pt-4">
                               <p>You are booking an appointment with {doctor.name}. Please select a date and time from the available slots.</p>
                               {selectedDate && <p className="font-semibold text-foreground flex items-center gap-2"><CalendarIcon className="h-4 w-4" />{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>}
                               {selectedTime && <p className="font-semibold text-foreground flex items-center gap-2"><Clock className="h-4 w-4" />{selectedTime}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column: Calendar and Time */}
                <div className="lg:col-span-2">
                    <Card>
                         <CardHeader>
                            <CardTitle>Select a Date & Time</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="p-0"
                                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                />
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-center md:text-left">
                                    {selectedDate ? format(selectedDate, 'MMMM d') : 'Available Slots'}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {availableTimes.map(time => (
                                        <Button 
                                            key={time} 
                                            variant={selectedTime === time ? 'default' : 'outline'}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                         <div className="p-6 pt-0 text-right">
                             <Button onClick={handleBooking} disabled={!selectedDate || !selectedTime}>
                                Confirm Appointment
                            </Button>
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function BookAppointmentPage() {
    return (
        <Suspense fallback={<div className="container py-8 text-center">Loading...</div>}>
            <BookAppointmentPageContent />
        </Suspense>
    )
}
