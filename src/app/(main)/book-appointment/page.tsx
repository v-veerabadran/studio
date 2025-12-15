
"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { allDoctors, type Doctor } from '@/lib/data';
import { Check, Star, X, ExternalLink, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

function BookAppointmentPageContent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>();
    const [reason, setReason] = useState("");

    useEffect(() => {
        const doctorId = searchParams.get('doctorId');
        if (doctorId) {
            const foundDoctor = allDoctors.find(d => d.id === parseInt(doctorId));
            setDoctor(foundDoctor || null);
        }
    }, [searchParams]);

    const availableTimes = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM"
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
        const eventEnd = new Date(appointmentDateTime.getTime() + 30 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '');

        const calendarUrl = new URL('https://www.google.com/calendar/render');
        calendarUrl.searchParams.append('action', 'TEMPLATE');
        calendarUrl.searchParams.append('text', `Appointment with ${doctor.name}`);
        calendarUrl.searchParams.append('dates', `${eventStart}/${eventEnd}`);
        calendarUrl.searchParams.append('details', `Reason: ${reason || 'Not specified'}\nDoctor: ${doctor.name}, ${doctor.specialty}\nLocation: ${doctor.hospital}`);
        calendarUrl.searchParams.append('location', doctor.hospital);


        toast({
            title: "Appointment Booked!",
            description: `Your appointment with ${doctor.name} on ${format(selectedDate, "PPP")} at ${selectedTime} is confirmed.`,
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
        return <div className="container py-8 text-center">Loading doctor information...</div>;
    }

    return (
        <div className="container py-8">
             <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint={doctor.imageHint} />
                                <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl">{doctor.name}</CardTitle>
                            <p className="text-muted-foreground">{doctor.specialty}</p>
                             <p className="text-sm text-muted-foreground">{doctor.hospital}</p>
                            <div className="flex items-center pt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-5 w-5 ${i < doctor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">({doctor.rating.toFixed(1)})</span>
                            </div>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                             <p><strong>Experience:</strong> {doctor.experience} years</p>
                             <p className="flex items-center">
                                <strong>Board Certified:</strong> 
                                {doctor.boardCertified ? <Check className="h-4 w-4 ml-2 text-green-600" /> : <X className="h-4 w-4 ml-2 text-red-600" />}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select a Date & Time</CardTitle>
                            <CardDescription>
                                {selectedDate ? format(selectedDate, "PPPP") : 'Please select a day'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    captionLayout="dropdown-buttons"
                                    fromYear={new Date().getFullYear()}
                                    toYear={new Date().getFullYear() + 1}
                                    className="p-0"
                                />
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-center md:text-left">Available Slots</h3>
                                <RadioGroup value={selectedTime} onValueChange={setSelectedTime} className="grid grid-cols-2 gap-2">
                                    {availableTimes.map(time => (
                                        <div key={time}>
                                            <RadioGroupItem value={time} id={time} className="sr-only" />
                                            <Label htmlFor={time} className="flex items-center justify-center w-full text-center p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                                {time}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Reason for Visit (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Please describe the reason for your appointment..." value={reason} onChange={(e) => setReason(e.target.value)} />
                        </CardContent>
                    </Card>
                    <Button size="lg" className="w-full" onClick={handleBooking}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Confirm Appointment
                    </Button>
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
