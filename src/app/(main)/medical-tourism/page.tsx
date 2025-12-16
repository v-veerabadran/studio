

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Printer, Home, Plane, BedDouble, HospitalIcon, BriefcaseMedical, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogCancel
  } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateVisaLetter } from '@/ai/flows/generate-visa-letter-flow';
import { packages } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { useIsMobile } from '@/hooks/use-mobile';


export default function MedicalTourismPage() {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [isVisaDialogOpen, setIsVisaDialogOpen] = useState(false);
    const [isPickupDialogOpen, setIsPickupDialogOpen] = useState(false);
    const [pickupDateTime, setPickupDateTime] = useState<Dayjs | null>(dayjs());

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

    const travelSteps = [
        { id: 'pickup', icon: Home, title: "Pickup from Home", description: "Coordinated transportation from your residence to the airport." },
        { id: 'flight', icon: Plane, title: "Flight Booking", description: "Your flight details and tickets will be managed and provided." },
        { id: 'hotel', icon: BedDouble, title: "Hotel/Motel Drop-off", description: "Seamless transfer from the destination airport to your accommodation." },
        { id: 'hospital', icon: HospitalIcon, title: "Hospital Transfer", description: "Scheduled pickup from your hotel for your hospital appointment." },
    ];


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormState(prevState => ({ ...prevState, [id]: value }));
    }

    const isFormValid = () => {
        return Object.values(formState).every(value => value.trim() !== '');
    }

    const handleGenerateLetter = async () => {
        if (!isFormValid()) {
            toast({
                title: "Missing Information",
                description: "Please fill out all fields to generate the letter.",
                variant: "destructive"
            })
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
                title: "Generation Failed",
                description: "Could not generate the visa support letter. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    }

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
    }

    const handleVisaDialogOpenChange = (open: boolean) => {
        setIsVisaDialogOpen(open);
        if (!open) {
            handleNewLetter();
        }
    }
    
    const handleConfirmPickup = () => {
        if (!pickupDateTime) {
            toast({
                title: "No date selected",
                description: "Please select a date and time for your pickup.",
                variant: "destructive"
            });
            return;
        }
        toast({
            title: "Pickup Scheduled!",
            description: `Your pickup is confirmed for ${pickupDateTime.format("MMMM D, YYYY, h:mm A")}.`
        });
        setIsPickupDialogOpen(false);
    }

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
                                    <Input id="estimatedStartDate" value={formState.estimatedStartDate} onChange={handleInputChange} placeholder="e.g., Approx. 2 weeks from visa approval"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estimatedDuration">Estimated Duration of Stay</Label>
                                    <Input id="estimatedDuration" value={formState.estimatedDuration} onChange={handleInputChange} placeholder="e.g., 3-4 weeks"/>
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
        
        <div className="space-y-8 mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Visa & Travel Support</CardTitle>
                    <CardDescription>All your logistical needs, managed in one place.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6 before:absolute before:left-[35px] before:top-0 before:h-full before:w-px before:bg-border before:-translate-x-1/2 md:pl-0 md:before:left-1/2 md:before:top-[24px] md:before:h-px md:before:w-full md:before:translate-x-0 md:before:-translate-y-1/2">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 md:gap-x-8">
                            {travelSteps.map((step, index) => (
                                <div key={index} className="relative flex md:flex-col items-start md:items-center gap-6 md:gap-2">
                                    <div className="relative z-10">
                                      <AlertDialog open={step.id === 'pickup' && isPickupDialogOpen} onOpenChange={step.id === 'pickup' ? setIsPickupDialogOpen : undefined}>
                                            <AlertDialogTrigger asChild>
                                                <button disabled={step.id !== 'pickup'} className="disabled:cursor-not-allowed group">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-background group-enabled:hover:bg-primary/90 transition-colors">
                                                        <step.icon className="h-6 w-6" />
                                                    </div>
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Schedule Your Pickup</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Please select your preferred date and time for pickup from your residence.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="py-4">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <StaticDateTimePicker 
                                                            orientation={isMobile ? "portrait" : "landscape"}
                                                            value={pickupDateTime}
                                                            onChange={(newValue) => setPickupDateTime(newValue)}
                                                            onAccept={handleConfirmPickup}
                                                            onClose={() => setIsPickupDialogOpen(false)}
                                                            ampm={true}
                                                            disablePast
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                    <div className="pt-2 md:pt-0 md:text-center">
                                        <h4 className="font-semibold">{step.title}</h4>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Explore Our All-Inclusive Packages</CardTitle>
                    <CardDescription>Curated packages for a seamless medical journey.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                        <Card key={pkg.id} className="flex flex-col">
                            <div className="relative h-48 w-full">
                            <Image src={pkg.imageUrl} alt={pkg.title} fill objectFit="cover" className="rounded-t-lg" data-ai-hint={pkg.imageHint} />
                            </div>
                            <CardHeader>
                            <CardTitle>{pkg.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 pt-1"><BriefcaseMedical className="h-4 w-4" />{pkg.price}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {pkg.highlights.slice(0, 2).map((highlight, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-primary mt-1">&#10003;</span>
                                    <span>{highlight}</span>
                                </li>
                                ))}
                            </ul>
                            </CardContent>
                            <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/medical-tourism/${pkg.id}`}>
                                    Learn More & Inquire
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            </CardFooter>
                        </Card>
                        ))}
                    </div>
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
