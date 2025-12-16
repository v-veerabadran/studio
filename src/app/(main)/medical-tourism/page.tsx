
'use client';

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
    FileText,
    Loader2,
    Printer,
    Home,
    Plane,
    Hotel,
    HospitalIcon,
    CheckCircle,
    Star,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateVisaLetter } from '@/ai/flows/generate-visa-letter-flow';
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
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [isVisaDialogOpen, setIsVisaDialogOpen] = useState(false);
    
    const [pickupDialogOpen, setPickupDialogOpen] = useState(false);
    const [pickupDateTime, setPickupDateTime] = useState<Dayjs | null>(null);
    const [tempPickupDateTime, setTempPickupDateTime] = useState<Dayjs | null>(dayjs());

    const [formState, setFormState] = useState({
        patientName: '',
        patientCountry: '',
        passportNumber: '',
        treatment: '',
        hospitalName: '',
        hospitalLocation: '',
        surgeonName: '',
        estimatedStartDate: '',
        estimatedDuration: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormState(prevState => ({ ...prevState, [id]: value }));
    };

    const isFormValid = () => {
        return Object.values(formState).every(value => value.trim() !== '');
    };

    const handleGenerateLetter = async () => {
        if (!isFormValid()) {
            toast({
                title: 'Missing Information',
                description: 'Please fill out all fields to generate the letter.',
                variant: 'destructive',
            });
            return;
        }

        setIsGenerating(true);
        setGeneratedLetter('');

        try {
            const result = await generateVisaLetter(formState);
            setGeneratedLetter(result.visaLetter);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Generation Failed',
                description: 'Could not generate the visa support letter. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNewLetter = () => {
        setIsGenerating(false);
        setGeneratedLetter('');
        setFormState({
            patientName: '',
            patientCountry: '',
            passportNumber: '',
            treatment: '',
            hospitalName: '',
            hospitalLocation: '',
            surgeonName: '',
            estimatedStartDate: '',
            estimatedDuration: '',
        });
    };

    const handleVisaDialogOpenChange = (open: boolean) => {
        setIsVisaDialogOpen(open);
        if (!open) {
            handleNewLetter();
        }
    };

    const handleConfirmPickup = () => {
        if (tempPickupDateTime) {
            setPickupDateTime(tempPickupDateTime);
            setPickupDialogOpen(false);
            toast({
                title: "Pickup Scheduled",
                description: `Your pickup is confirmed for ${tempPickupDateTime.format("MMM D, YYYY 'at' h:mm A")}.`
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
                                value={tempPickupDateTime}
                                onChange={(newValue) => setTempPickupDateTime(newValue)}
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
        <>
            <div className="container py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Medical Tourism</h1>
                    <AlertDialog open={isVisaDialogOpen} onOpenChange={handleVisaDialogOpenChange}>
                        <AlertDialogTrigger asChild>
                            <Button>
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Visa Letter
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-2xl print:hidden">
                            {!generatedLetter ? (
                                <>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Visa Support Letter Generator</AlertDialogTitle>
                                        <AlertDialogDescription>Fill in the details below to generate a personalized visa support letter.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="patientName">Full Name (as on passport)</Label>
                                                <Input id="patientName" value={formState.patientName} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="passportNumber">Passport Number</Label>
                                                <Input id="passportNumber" value={formState.passportNumber} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="patientCountry">Country of Citizenship</Label>
                                            <Input id="patientCountry" value={formState.patientCountry} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="treatment">Medical Procedure/Package</Label>
                                            <Input id="treatment" value={formState.treatment} onChange={handleInputChange} />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="hospitalName">Hospital Name</Label>
                                                <Input id="hospitalName" value={formState.hospitalName} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="hospitalLocation">Hospital Location (City, Country)</Label>
                                                <Input id="hospitalLocation" value={formState.hospitalLocation} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="surgeonName">Attending Surgeon's Name</Label>
                                            <Input id="surgeonName" value={formState.surgeonName} onChange={handleInputChange} />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="estimatedStartDate">Estimated Start Date</Label>
                                                <Input id="estimatedStartDate" value={formState.estimatedStartDate} onChange={handleInputChange} placeholder="e.g., Approx. 2 weeks from visa approval" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="estimatedDuration">Estimated Duration of Stay</Label>
                                                <Input id="estimatedDuration" value={formState.estimatedDuration} onChange={handleInputChange} placeholder="e.g., 3-4 weeks" />
                                            </div>
                                        </div>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <Button onClick={handleGenerateLetter} disabled={isGenerating || !isFormValid()}>
                                            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Generate
                                        </Button>
                                    </AlertDialogFooter>
                                </>
                            ) : (
                                <>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Generated Visa Support Letter</AlertDialogTitle>
                                        <AlertDialogDescription>Your letter has been generated. You can now print it or save it as a PDF.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    {isGenerating ? (
                                        <div className="flex items-center justify-center h-64">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : (
                                        <div id="visa-letter-content" className="prose prose-sm max-w-none h-64 overflow-y-auto rounded-md border p-4 bg-muted whitespace-pre-wrap font-sans">
                                            {generatedLetter}
                                        </div>
                                    )}
                                    <AlertDialogFooter>
                                        <Button variant="outline" onClick={handleNewLetter}>Generate New Letter</Button>
                                        <Button onClick={() => window.print()}>
                                            <Printer className="mr-2 h-4 w-4" />
                                            Print / Save as PDF
                                        </Button>
                                    </AlertDialogFooter>
                                </>
                            )}
                        </AlertDialogContent>
                    </AlertDialog>
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
                                    <div key={index} className="relative flex items-start pb-8">
                                        <div className="absolute left-[11px] top-4 -ml-px mt-0.5 h-full w-0.5 bg-border" />
                                        <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-background ring-4 ring-primary">
                                            {step.isComplete ? <CheckCircle className="h-5 w-5 text-primary" /> : <step.icon className="h-4 w-4 text-primary" />}
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <h4 className="font-semibold">{step.title}</h4>
                                            <p className="text-sm text-muted-foreground">{step.description}</p>
                                            <div className="mt-2">
                                                {step.action}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Accommodation</CardTitle>
                            <CardDescription>Details about your hotel stay.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                <Image src="https://picsum.photos/seed/hotel1/600/400" alt="Hotel exterior" fill objectFit="cover" data-ai-hint="hotel exterior" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Grand Metropolis Hotel</h3>
                                <p className="text-sm text-muted-foreground">123 Wellness Ave, Metropolis</p>
                                <div className="flex items-center mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                    <span className="ml-2 text-sm text-muted-foreground">(4.5)</span>
                                </div>
                            </div>
                             <Button className="w-full">View Hotel Details</Button>
                        </CardContent>
                    </Card>

                </div>

            </div>
            <div id="printable-visa-letter" className="hidden print:block p-8 font-serif">
                <h1 className="text-2xl font-bold mb-4">{formState.hospitalName}</h1>
                <p className="mb-2">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="whitespace-pre-wrap text-base">
                    {generatedLetter}
                </div>
            </div>
        </>
    );
}

    