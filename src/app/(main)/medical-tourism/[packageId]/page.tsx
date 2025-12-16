
'use client';

import { useParams, notFound } from 'next/navigation';
import { packages, allHospitals, allDoctors } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, MapPin, Stethoscope, BriefcaseMedical, CalendarDays, DollarSign, ListChecks, FileText, Loader2, Printer } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateVisaLetter } from '@/ai/flows/generate-visa-letter-flow';
import { Textarea } from '@/components/ui/textarea';


export default function PackageDetailPage() {
  const params = useParams();
  const packageId = params.packageId;
  const pkg = packages.find((p) => p.id.toString() === packageId);

  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formState, setFormState] = useState({
    patientName: '',
    patientCountry: '',
    passportNumber: '',
    treatment: pkg?.title || '',
    hospitalName: pkg?.hospital.name || '',
    hospitalLocation: pkg?.hospital.location || '',
    surgeonName: pkg?.surgeon.name || '',
    estimatedStartDate: 'Approx. 2 weeks from visa approval',
    estimatedDuration: '3-4 weeks',
  });

  if (!pkg) {
    notFound();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  }

  const isFormValid = () => {
    return formState.patientName.trim() !== '' && formState.patientCountry.trim() !== '' && formState.passportNumber.trim() !== '';
  }

  const handleGenerateLetter = async () => {
    if (!isFormValid()) {
        toast({
            title: "Missing Information",
            description: "Please fill out all patient fields to generate the letter.",
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
        ...formState,
        patientName: '',
        patientCountry: '',
        passportNumber: '',
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
        {/* Header */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            <Image src={pkg.imageUrl} alt={pkg.title} fill objectFit="cover" data-ai-hint={pkg.imageHint} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{pkg.title}</h1>
                <p className="text-lg text-white/90">{pkg.description}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListChecks /> What's Included</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {pkg.inclusions.map((item, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">{item.item}</p>
                                        <p className="text-sm text-muted-foreground">{item.details}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CalendarDays /> Sample Itinerary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative pl-6 before:absolute before:left-[11px] before:top-0 before:h-full before:w-px before:bg-border">
                            {pkg.itinerary.map((item, index) => (
                                <div key={index} className="relative mb-6">
                                    <div className="absolute -left-3.5 mt-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                                    <p className="font-semibold">Day {item.day}</p>
                                    <p className="text-sm text-muted-foreground">{item.activity}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                 <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DollarSign /> Pricing & Booking</CardTitle>
                        <p className="text-3xl font-bold pt-2">{pkg.price}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                             <p className="font-semibold flex items-center gap-2"><MapPin/> Hospital</p>
                             <Link href="#" className="flex items-center gap-4 p-2 rounded-md hover:bg-accent">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={pkg.hospital.imageUrl} alt={pkg.hospital.name} data-ai-hint={pkg.hospital.imageHint} />
                                    <AvatarFallback>{pkg.hospital.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{pkg.hospital.name}</p>
                                    <p className="text-xs text-muted-foreground">{pkg.hospital.location}</p>
                                </div>
                             </Link>
                         </div>
                         <Separator />
                          <div className="space-y-2">
                             <p className="font-semibold flex items-center gap-2"><Stethoscope/> Lead Surgeon</p>
                              <Link href={`/doctors?view_doctor=${pkg.surgeon.id}`} className="flex items-center gap-4 p-2 rounded-md hover:bg-accent">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={pkg.surgeon.imageUrl} alt={pkg.surgeon.name} data-ai-hint={pkg.surgeon.imageHint} />
                                    <AvatarFallback>{pkg.surgeon.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{pkg.surgeon.name}</p>
                                    <p className="text-xs text-muted-foreground">{pkg.surgeon.specialty}</p>
                                </div>
                             </Link>
                         </div>
                    </CardContent>
                    <CardContent>
                         <AlertDialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                            <AlertDialogTrigger asChild>
                                 <Button variant="outline" className="w-full">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Generate Visa Letter
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-2xl print:hidden">
                                 {!generatedLetter ? (
                                    <>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Visa Support Letter Generator</AlertDialogTitle>
                                        <AlertDialogDescription>Fill in your details below to generate a visa support letter for the "{pkg.title}".</AlertDialogDescription>
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
                                            <Input id="treatment" value={formState.treatment} onChange={handleInputChange} disabled />
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
                        <Button className="w-full mt-2">Book This Package</Button>
                    </CardContent>
                 </Card>
            </div>
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
