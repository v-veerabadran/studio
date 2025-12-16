
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
import { FileText, Loader2, Printer } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

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

  return (
    <>
    <div className="container py-12">
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Visa Support Letter Generator</CardTitle>
                <CardDescription>Fill in the details below to generate a personalized visa support letter from the hospital for your medical travel to India.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter>
                 <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full" disabled={!isFormValid()}>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Visa Letter
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-2xl print:hidden">
                         <AlertDialogHeader>
                            <AlertDialogTitle>Generated Visa Support Letter</AlertDialogTitle>
                            {!generatedLetter && !isGenerating && <AlertDialogDescription>Review the details and click Generate.</AlertDialogDescription>}
                        </AlertDialogHeader>

                        {isGenerating ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : generatedLetter ? (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Your letter has been generated. You can now print it or save it as a PDF.</p>
                                <div id="visa-letter-content" className="prose prose-sm max-w-none h-64 overflow-y-auto rounded-md border p-4 bg-muted whitespace-pre-wrap font-sans">
                                    {generatedLetter}
                                </div>
                            </div>
                        ) : (
                             <div className="space-y-2">
                                <p className="text-sm font-semibold">Please confirm the details below before generating the letter.</p>
                                <ul className="text-sm text-muted-foreground list-disc list-inside">
                                    <li>Patient: {formState.patientName}</li>
                                    <li>Treatment: {formState.treatment}</li>
                                    <li>Hospital: {formState.hospitalName}</li>
                                </ul>
                             </div>
                        )}
                       
                        <AlertDialogFooter>
                             {generatedLetter ? (
                                <>
                                    <Button variant="outline" onClick={handleNewLetter}>Generate New Letter</Button>
                                    <Button onClick={() => window.print()}>
                                        <Printer className="mr-2 h-4 w-4" />
                                        Print / Save as PDF
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <Button onClick={handleGenerateLetter} disabled={isGenerating}>
                                        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Generate
                                    </Button>
                                </>
                            )}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
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
