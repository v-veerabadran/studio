
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
import { Card, CardContent } from '@/components/ui/card';
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
    }

    return (
        <div className="container py-8">
             <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
            <Card>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column: Form Inputs */}
                    <div className="space-y-8">
                        <div>
                            <Label htmlFor="doctor-select" className="text-sm font-semibold text-muted-foreground">1. Select a Doctor</Label>
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
                            <Label htmlFor="reason-for-visit" className="text-sm font-semibold text-muted-foreground">2. Reason for Visit (Optional)</Label>
                            <Textarea 
                                id="reason-for-visit"
                                className="mt-2"
                                placeholder="Briefly describe the reason for your appointment..." 
                                value={reasonForVisit}
                                onChange={(e) => setReasonForVisit(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-semibold text-muted-foreground">3. Select Visit Type</Label>
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
                    </div>

                    {/* Right Column: Calendar and Time */}
                    <div className="space-y-8">
                       <div>
                            <Label className="text-sm font-semibold text-muted-foreground">4. Select a Date & Time</Label>
                            <div className="mt-2">
                                 <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="p-0"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
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
