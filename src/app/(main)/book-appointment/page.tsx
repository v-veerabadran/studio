
"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { allDoctors, type Doctor } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Link from 'next/link';
import { ExternalLink, Video, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

function BookAppointmentPageContent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>();
    const [reasonForVisit, setReasonForVisit] = useState("");
    const [visitType, setVisitType] = useState<"in-person" | "virtual">("in-person");

    useEffect(() => {
        const doctorId = searchParams.get('doctorId');
        if (doctorId) {
            const foundDoctor = allDoctors.find(d => d.id === parseInt(doctorId));
            setDoctor(foundDoctor || null);
            setSelectedDoctorId(String(foundDoctor?.id));
        }
    }, [searchParams]);
    
    const handleDoctorChange = (doctorId: string) => {
        const foundDoctor = allDoctors.find(d => d.id === parseInt(doctorId));
        setDoctor(foundDoctor || null);
        setSelectedDoctorId(doctorId);
        setSelectedTime(undefined); // Reset time when doctor changes
    }

    const availableTimes = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    ];

    const handleBooking = () => {
        if (!selectedDate || !selectedTime || !doctor) {
            toast({
                title: "Incomplete Information",
                description: "Please select a doctor, date, and time for your appointment.",
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
        const details = `Doctor: ${doctor.name}, ${doctor.specialty}\nReason: ${reasonForVisit || 'Not specified'}\nType: ${visitType}`;
        calendarUrl.searchParams.append('details', details);
        calendarUrl.searchParams.append('location', visitType === 'in-person' ? doctor.hospital : 'Video Call');

        toast({
            title: "Appointment Confirmed!",
            description: `Your ${visitType} appointment with ${doctor.name} is set for ${format(selectedDate, "PPP")} at ${selectedTime}.`,
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

    return (
        <div className="container py-8">
             <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
            <Card className="max-w-4xl mx-auto">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Left Column: Form Inputs */}
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="doctor-select" className="text-sm font-semibold">1. Select a Doctor</Label>
                                <Select onValueChange={handleDoctorChange} value={selectedDoctorId}>
                                    <SelectTrigger id="doctor-select" className="mt-2">
                                        <SelectValue placeholder="Choose a doctor..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allDoctors.map(doc => (
                                            <SelectItem key={doc.id} value={String(doc.id)}>
                                                <div className="flex items-center gap-3">
                                                     <Avatar className="h-8 w-8">
                                                        <AvatarImage src={doc.imageUrl} alt={doc.name} data-ai-hint={doc.imageHint} />
                                                        <AvatarFallback>{doc.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">{doc.name}</p>
                                                        <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Label htmlFor="reason-for-visit" className="text-sm font-semibold">2. Reason for Visit (Optional)</Label>
                                <Textarea 
                                    id="reason-for-visit"
                                    className="mt-2"
                                    placeholder="Briefly describe the reason for your appointment..." 
                                    value={reasonForVisit}
                                    onChange={(e) => setReasonForVisit(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-semibold">3. Select Visit Type</Label>
                                <RadioGroup defaultValue="in-person" className="grid grid-cols-2 gap-4 mt-2" onValueChange={(value) => setVisitType(value as "in-person" | "virtual")}>
                                    <Label htmlFor="in-person" className="flex items-center gap-3 border rounded-md p-4 cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                                        <RadioGroupItem value="in-person" id="in-person" />
                                        <Building className="h-5 w-5" />
                                        <span className="font-medium">In-Person</span>
                                    </Label>
                                     <Label htmlFor="virtual" className="flex items-center gap-3 border rounded-md p-4 cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                                        <RadioGroupItem value="virtual" id="virtual" />
                                        <Video className="h-5 w-5" />
                                        <span className="font-medium">Virtual</span>
                                    </Label>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* Right Column: Calendar and Time */}
                        <div className="space-y-6">
                           <div>
                                <Label className="text-sm font-semibold">4. Select a Date & Time</Label>
                                <div className="border rounded-md mt-2">
                                     <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => { setSelectedDate(date); setSelectedTime(undefined); }}
                                        className="p-3"
                                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                        fromYear={new Date().getFullYear()}
                                        toYear={new Date().getFullYear() + 1}
                                        captionLayout="dropdown-buttons"
                                    />
                                    <div className="p-3 border-t">
                                        <h3 className="font-semibold text-center text-sm mb-4">
                                            Available Slots on {selectedDate ? format(selectedDate, 'MMMM d') : 'selected date'}
                                        </h3>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {availableTimes.map(time => (
                                                <Button 
                                                    key={time} 
                                                    variant={selectedTime === time ? 'default' : 'outline'}
                                                    onClick={() => setSelectedTime(time)}
                                                    size="sm"
                                                    disabled={!doctor || !selectedDate}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-4 border-t pt-6">
                     <Button 
                        onClick={handleBooking} 
                        disabled={!selectedDate || !selectedTime || !doctor}
                        size="lg"
                        className="w-full"
                    >
                        Confirm Appointment
                    </Button>
                     {doctor && selectedDate && selectedTime && (
                        <Card className="bg-muted/50 border-0">
                            <CardHeader className="p-4">
                                <CardTitle className="text-base">Appointment Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm p-4 pt-0">
                                <p><strong>Doctor:</strong> {doctor.name}</p>
                                <p><strong>Date:</strong> {format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                                <p><strong>Time:</strong> {selectedTime}</p>
                                <p><strong>Type:</strong> {visitType === 'in-person' ? 'In-Person' : 'Virtual'}</p>
                            </CardContent>
                        </Card>
                    )}
                </CardFooter>
            </Card>
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
