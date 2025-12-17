
"use client";

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { doctorData, hospitalData } from '@/lib/data';
import type { Doctor, Hospital } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Building, Video, Clock } from 'lucide-react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { useIsMobile } from '@/hooks/use-mobile';


function BookAppointmentPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const isMobile = useIsMobile();
    
    const allDoctors = useMemo(() => Object.values(doctorData).flat(), []);
    const allHospitals = useMemo(() => Object.values(hospitalData).flat(), []);

    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(null);
    const [tempDateTime, setTempDateTime] = useState<Dayjs | null>(dayjs());
    const [reasonForVisit, setReasonForVisit] = useState("");
    const [visitType, setVisitType] = useState<"in-person" | "virtual">("in-person");

    useEffect(() => {
        const doctorId = searchParams.get('doctorId');
        const hospitalId = searchParams.get('hospitalId');

        let initialDoctors = allDoctors;

        if (hospitalId) {
            const foundHospital = allHospitals.find(h => h.id === hospitalId);
            if (foundHospital) {
                setHospital(foundHospital);
                const affiliatedDoctors = allDoctors.filter(d => d.hospital === foundHospital.name);
                setDoctorsList(affiliatedDoctors);
                initialDoctors = affiliatedDoctors;
            }
        } else {
            setDoctorsList(allDoctors);
        }
        
        if (doctorId) {
            const foundDoctor = allDoctors.find(d => d.id === doctorId);
            if(foundDoctor) {
                setDoctor(foundDoctor || null);
                setSelectedDoctorId(String(foundDoctor?.id));
                const affiliatedHospital = allHospitals.find(h => h.name === foundDoctor.hospital);
                if (affiliatedHospital) {
                    setHospital(affiliatedHospital);
                }
            }
        }
    }, [searchParams, allDoctors, allHospitals]);
    
    const handleDoctorChange = (doctorId: string) => {
        const foundDoctor = allDoctors.find(d => d.id === doctorId);
        setDoctor(foundDoctor || null);
        setSelectedDoctorId(doctorId);
    }
    
    const handleConfirmBooking = () => {
         if (!doctor || !selectedDateTime) {
            toast({
                title: "Incomplete Information",
                description: "Please select a doctor, date, and time.",
                variant: "destructive",
            });
            return;
        }

        const query = new URLSearchParams({
            doctorId: doctor.id.toString(),
            date: selectedDateTime.toISOString(),
            time: selectedDateTime.format('hh:mm A'),
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className="space-y-8">
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
                </div>
                <div className="space-y-8">
                    <Card>
                         <CardHeader>
                            <CardTitle>4. Select a Date & Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <StaticDateTimePicker 
                                  orientation={isMobile ? "portrait" : "landscape"} 
                                  value={tempDateTime}
                                  onChange={(newValue) => setTempDateTime(newValue)}
                                  onAccept={(newValue) => setSelectedDateTime(newValue)}
                                  onClose={() => setTempDateTime(selectedDateTime || dayjs())}
                                  ampm={true}
                                  disablePast
                                />
                            </LocalizationProvider>
                        </CardContent>
                    </Card>
                     <Button size="lg" className="w-full" onClick={handleConfirmBooking} disabled={!doctor || !selectedDateTime}>
                        Proceed to Payment
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
