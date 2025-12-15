
"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { allDoctors, type Doctor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

function BookAppointmentPageContent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>("8:00 PM");

    useEffect(() => {
        const doctorId = searchParams.get('doctorId');
        if (doctorId) {
            const foundDoctor = allDoctors.find(d => d.id === parseInt(doctorId));
            setDoctor(foundDoctor || null);
        } else {
            // If no doctor is selected, maybe default to the first one or show a selection UI
            setDoctor(allDoctors[0]);
        }
    }, [searchParams]);

    const availableTimes = [
        "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM",
        "10:00 PM", "11:00 PM", "12:00 AM", "1:00 AM"
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
    
    const today = new Date();

    const getFullSelectedDateTime = () => {
        if(!selectedDate || !selectedTime) return '';
        const date = format(selectedDate, "MMMM d, yyyy");
        return `${date} ${selectedTime}`;
    }

    return (
        <div className="container py-8 flex justify-center items-center h-full">
            <div className="bg-card text-card-foreground rounded-lg shadow-lg w-full max-w-2xl relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-card transform rotate-45"></div>
                <div className="flex">
                    {/* Calendar Section */}
                    <div className="w-[65%] p-4">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="p-0"
                        />
                    </div>
                    {/* Time Slot Section */}
                    <div className="w-[35%] border-l border-border/50">
                        <div className="p-4 flex flex-col h-full">
                            {availableTimes.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={cn(
                                        "text-left p-2 rounded-md text-sm w-full",
                                        "text-muted-foreground hover:text-foreground",
                                        selectedTime === time && "bg-primary text-primary-foreground hover:text-primary-foreground"
                                    )}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                 {/* Footer */}
                <div className="border-t border-border/50 p-3 flex justify-between items-center text-sm">
                    <Button variant="ghost" className="uppercase text-xs tracking-wider" onClick={() => setSelectedDate(today)}>Today</Button>
                    <p className="text-muted-foreground uppercase text-xs tracking-wider">{getFullSelectedDateTime()}</p>
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
