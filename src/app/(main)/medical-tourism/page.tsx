
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
import { FileText, Loader2, Printer, Home, Plane, BedDouble, HospitalIcon } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateVisaLetter } from '@/ai/flows/generate-visa-letter-flow';
import { cn } from '@/lib/utils';

export default function MedicalTourismPage() {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        { icon: Home, title: "Pickup from Home", description: "Coordinated transportation from your residence to the airport." },
        { icon: Plane, title: "Flight Booking", description: "Your flight details and tickets will be managed and provided." },
        { icon: BedDouble, title: "Hotel/Motel Drop-off", description: "Seamless transfer from the destination airport to your accommodation." },
        { icon: HospitalIcon, title: "Hospital Transfer", description: "Scheduled pickup from your hotel for your hospital appointment." },
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

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            handleNewLetter();
        }
    }

  return (
    <>
    <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Medical Tourism</h1>
            <AlertDialog open={isDialogOpen} onOpenChange={handleOpenChange}>
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
        
        <Card>
            <CardHeader>
                <CardTitle>Your Travel Itinerary</CardTitle>
                <CardDescription>A step-by-step overview of your managed travel arrangements.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative pl-6 before:absolute before:left-[35px] before:top-0 before:h-full before:w-px before:bg-border before:-translate-x-1/2">
                    {travelSteps.map((step, index) => (
                        <div key={index} className="relative flex items-start gap-6 pb-8 last:pb-0">
                            <div className="relative z-10">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-background">
                                    <step.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="pt-2">
                                <h4 className="font-semibold">{step.title}</h4>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

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
