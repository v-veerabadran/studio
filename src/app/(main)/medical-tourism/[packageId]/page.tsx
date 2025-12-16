
'use client';

import { useParams, notFound } from 'next/navigation';
import { packages, allHospitals, allDoctors } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, MapPin, Stethoscope, BriefcaseMedical, CalendarDays, DollarSign, ListChecks, FileText, Loader2, Printer, Filter, Info } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const countries = [
    { name: 'United States', code: 'US', states: ['California', 'New York', 'Texas', 'Florida'] },
    { name: 'Canada', code: 'CA', states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'] },
    { name: 'United Kingdom', code: 'GB', states: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
];

export default function PackageDetailPage() {
  const params = useParams();
  const packageId = params.packageId;
  const pkg = packages.find((p) => p.id.toString() === packageId);

  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  
  const handleCountryChange = (countryCode: string) => {
      setSelectedCountry(countryCode);
      setSelectedState(''); // Reset state when country changes
  }

  const currentStates = countries.find(c => c.code === selectedCountry)?.states || [];

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
  
  // A check to see if we are on the Diamond Package page to show the filters.
  const isDiamondPackage = pkg.title === 'Comprehensive Cardiac Care Package';

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
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{pkg.title}</h1>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 mb-2">
                                <Info className="h-6 w-6" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl">{pkg.title} - Details</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Review the inclusions and terms for this package.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 text-foreground">Package Inclusions</h3>
                                    <ul className="space-y-3">
                                        {pkg.inclusions.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-foreground">{item.item}</p>
                                                    <p className="text-muted-foreground">{item.details}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 text-foreground">Terms & Conditions</h3>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>Prices are indicative and subject to change based on the final treatment plan.</li>
                                        <li>Package does not cover costs for any additional, unforeseen treatments or complications.</li>
                                        <li>Accommodation is for the patient only. Companion charges are separate.</li>
                                        <li>Visa approval is at the sole discretion of the embassy.</li>
                                        <li>A 50% advance payment is required to confirm the booking.</li>
                                    </ul>
                                </div>
                            </div>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogAction>Close</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <p className="text-lg text-white/90">{pkg.description}</p>
            </div>
        </div>

        {isDiamondPackage && (
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filter Options</CardTitle>
                    <CardDescription>Find providers for this package in a specific location.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select onValueChange={handleCountryChange} value={selectedCountry}>
                            <SelectTrigger id="country">
                                <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(country => (
                                    <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="state">State / Province</Label>
                        <Select onValueChange={setSelectedState} value={selectedState} disabled={!selectedCountry}>
                            <SelectTrigger id="state">
                                <SelectValue placeholder="Select a state" />
                            </SelectTrigger>
                            <SelectContent>
                                {currentStates.map(state => (
                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button>Apply Filters</Button>
                </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <p className="text-muted-foreground">Select a treatment package to see more details here.</p>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                
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
