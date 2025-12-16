
"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle,
    Home,
    Plane,
    Hotel,
    HospitalIcon,
    Star,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';

export default function MedicalTourismPage() {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    
    const [pickupDialogOpen, setPickupDialogOpen] = useState(false);
    const [pickupDateTime, setPickupDateTime] = useState<Dayjs | null>(null);
    const [tempDateTime, setTempDateTime] = useState<Dayjs | null>(dayjs());

    const handleConfirmPickup = () => {
        setPickupDateTime(tempDateTime);
        if (tempDateTime) {
            setPickupDialogOpen(false);
            toast({
                title: "Pickup Scheduled",
                description: `Your pickup is confirmed for ${tempDateTime.format("MMM D, YYYY 'at' h:mm A")}.`
            })
        }
    };

    const travelSteps = [
        {
            icon: Home,
            title: 'Pickup from Home',
            description: pickupDateTime ? `Scheduled for ${pickupDateTime.format("MMM D, h:mm A")}` : 'Not yet scheduled',
            action: (
                 <AlertDialog open={pickupDialogOpen} onOpenChange={setPickupDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">{pickupDateTime ? "Reschedule" : "Schedule"}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Schedule Home Pickup</AlertDialogTitle>
                            <AlertDialogDescription>
                                Select a date and time for your pickup. A representative will contact you to confirm.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StaticDateTimePicker
                                orientation={isMobile ? 'portrait' : 'landscape'}
                                value={tempDateTime}
                                onChange={(newValue) => setTempDateTime(newValue)}
                                onAccept={handleConfirmPickup}
                                onClose={() => setPickupDialogOpen(false)}
                                ampm={true}
                                disablePast
                            />
                        </LocalizationProvider>
                    </AlertDialogContent>
                </AlertDialog>
            ),
            isComplete: !!pickupDateTime
        },
        { icon: Plane, title: 'Flight Ticket Booking', description: 'Pending', isComplete: false },
        { icon: Hotel, title: 'Drop to Hotel/Motel', description: 'Pending', isComplete: false },
        { icon: HospitalIcon, title: 'Drop to Hospital', description: 'Pending', isComplete: false },
    ];

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Medical Tourism</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Travel Itinerary</CardTitle>
                        <CardDescription>Follow your seamless journey from home to hospital.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative pl-6">
                            {travelSteps.map((step, index) => (
                                <div key={index} className="relative flex items-start pb-8 last:pb-0">
                                    {index !== travelSteps.length - 1 && <div className="absolute left-[11px] top-4 -ml-px mt-0.5 h-full w-0.5 bg-border" />}
                                    <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-background ring-4 ring-primary">
                                        {step.isComplete ? <CheckCircle className="h-5 w-5 text-primary" /> : <step.icon className="h-4 w-4 text-primary" />}
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <h4 className="font-semibold">{step.title}</h4>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                        {step.action && <div className="mt-2">{step.action}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Accommodation</CardTitle>
                        <CardDescription>Details about your reserved hotel.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative h-48 w-full rounded-lg overflow-hidden">
                            <Image src="https://picsum.photos/seed/hotel1/600/400" alt="Hotel exterior" fill objectFit="cover" data-ai-hint="luxury hotel" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Grand Metropolis Hotel</h3>
                             <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                                <span className="ml-2 text-xs text-muted-foreground">(4.5)</span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your comfortable stay includes complimentary breakfast and transport to the hospital.
                        </p>
                        <Button variant="outline" className="w-full">View Hotel Details</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
