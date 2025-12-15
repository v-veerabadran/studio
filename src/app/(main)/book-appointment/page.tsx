
"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { allDoctors, type Doctor, allHospitals, type Hospital } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Building, Video, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const availableTimes = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
];

function BookAppointmentPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [doctorsList, setDoctorsList] = useState<Doctor[]>(allDoctors);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<string | undefined>();
    const [reasonForVisit, setReasonForVisit] = useState("");
    const [visitType, setVisitType] = useState<"in-person" | "virtual">("in-person");

    useEffect(() => {
        const doctorId = searchParams.get('doctorId');
        const hospitalId = searchParams.get('hospitalId');

        if (hospitalId) {
            const foundHospital = allHospitals.find(h => h.id === parseInt(hospitalId));
            if (foundHospital) {
                setHospital(foundHospital);
                const affiliatedDoctors = allDoctors.filter(d => d.hospital === foundHospital.name);
                setDoctorsList(affiliatedDoctors);
            }
        }
        
        if (doctorId) {
            const foundDoctor = allDoctors.find(d => d.id === parseInt(doctorId));
            if(foundDoctor) {
                setDoctor(foundDoctor || null);
                setSelectedDoctorId(String(foundDoctor?.id));
                const affiliatedHospital = allHospitals.find(h => h.name === foundDoctor.hospital);
                if (affiliatedHospital) {
                    setHospital(affiliatedHospital);
                }
            }
        }
    }, [searchParams]);
    
    const handleDoctorChange = (doctorId: string) => {
        const foundDoctor = allDoctors.find(d => d.id === parseInt(doctorId));
        setDoctor(foundDoctor || null);
        setSelectedDoctorId(doctorId);
    }
    
    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedTime(undefined); // Reset time when date changes
    }
    
    const handleConfirmBooking = () => {
         if (!doctor || !selectedDate || !selectedTime) {
            toast({
                title: "Incomplete Information",
                description: "Please select a doctor, date, and time.",
                variant: "destructive",
            });
            return;
        }

        const query = new URLSearchParams({
            doctorId: doctor.id.toString(),
            date: selectedDate.toISOString(),
            time: selectedTime,
            reason: reasonForVisit,
            type: visitType
        }).toString();

        router.push(`/payment?${query}`);
    }

    return (
        <div className="container py-8 space-y-8">
             <div className="text-center">
                <h1 className="text-3xl font-bold">Book an Appointment</h1>
                {hospital && <p className="text-muted-foreground mt-2">Booking for {hospital.name}</p>}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appointment Details</CardTitle>
                            <CardDescription>Fill in the details for your appointment.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="doctor-select" className="font-semibold">1. Select a Doctor</Label>
                                <Select onValueChange={handleDoctorChange} value={selectedDoctorId}>
                                    <SelectTrigger id="doctor-select" className="mt-2">
                                        <SelectValue placeholder="Choose a doctor..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctorsList.map(doc => (
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
                                <Label htmlFor="reason-for-visit" className="font-semibold">2. Reason for Visit (Optional)</Label>
                                <Textarea 
                                    id="reason-for-visit"
                                    className="mt-2"
                                    placeholder="Briefly describe the reason for your appointment..." 
                                    value={reasonForVisit}
                                    onChange={(e) => setReasonForVisit(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="font-semibold">3. Select Visit Type</Label>
                                <RadioGroup defaultValue="in-person" className="grid grid-cols-2 gap-4 mt-2" onValueChange={(value) => setVisitType(value as "in-person" | "virtual")}>
                                    <Label htmlFor="in-person" className="flex items-center gap-3 border rounded-md p-4 cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                                        <RadioGroupItem value="in-person" id="in-person" />
                                        <Building className="h-5 w-5 text-primary" />
                                        <span className="font-medium">In-Person</span>
                                    </Label>
                                    <Label htmlFor="virtual" className="flex items-center gap-3 border rounded-md p-4 cursor-pointer has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                                        <RadioGroupItem value="virtual" id="virtual" />
                                        <Video className="h-5 w-5 text-primary" />
                                        <span className="font-medium">Virtual</span>
                                    </Label>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Select a Date & Time</CardTitle>
                            <CardDescription>Choose an available date and time for your appointment.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    className="p-0"
                                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                />
                            </div>
                            <div className="h-full">
                                {selectedDate ? (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-center md:text-left">
                                            Available Slots for {format(selectedDate, "PPP")}
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableTimes.map(time => (
                                                <Button 
                                                    key={time}
                                                    variant={selectedTime === time ? "default" : "outline"}
                                                    onClick={() => setSelectedTime(time)}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
                                        <Clock className="h-12 w-12 text-muted-foreground" />
                                        <p className="mt-4 text-muted-foreground">Select a date to see available times.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                         <CardHeader>
                            <CardTitle>Appointment Summary</CardTitle>
                            <CardDescription>Review your details before proceeding.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {doctor ? (
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint={doctor.imageHint} />
                                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{doctor.name}</p>
                                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                        <p className="text-xs text-muted-foreground">{doctor.hospital}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Please select a doctor.</p>
                            )}

                            {selectedDate && selectedTime ? (
                                <div>
                                    <p className="font-bold">{format(selectedDate, "PPP")}</p>
                                    <p className="text-sm text-muted-foreground">{selectedTime}</p>
                                </div>
                            ) : (
                                 <p className="text-sm text-muted-foreground">Please select a date and time.</p>
                            )}
                             <p className={cn("text-sm capitalize", visitType === 'in-person' ? 'flex items-center gap-2' : 'flex items-center gap-2')}>
                                {visitType === 'in-person' ? <Building className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                                {visitType} Visit
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full" onClick={handleConfirmBooking} disabled={!doctor || !selectedDate || !selectedTime}>
                                Proceed to Payment
                            </Button>
                        </CardFooter>
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
