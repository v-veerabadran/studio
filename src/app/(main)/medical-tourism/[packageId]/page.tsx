
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { packages, allHospitals, allDoctors, hospitalData, type Hospital } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle, MapPin, Stethoscope, BriefcaseMedical, CalendarDays, DollarSign, ListChecks, FileText, Loader2, Printer, Filter, Info, Star } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect, useMemo } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateVisaLetter } from '@/ai/flows/generate-visa-letter-flow';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const countries = [
    { name: 'United States', code: 'US', states: ['California', 'New York', 'Texas', 'Florida'] },
    { name: 'Canada', code: 'CA', states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'] },
    { name: 'United Kingdom', code: 'GB', states: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
];

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.packageId;
  const pkg = packages.find((p) => p.id.toString() === packageId);

  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const relevantHospitals = useMemo(() => {
    if (!pkg) return [];
    const specialty = pkg.hospital.specialty.toLowerCase();
    const key = specialty as keyof typeof hospitalData;
    if (key in hospitalData) {
      return hospitalData[key] || [];
    }
    return [];
  }, [pkg]);
  
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>(relevantHospitals);

  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [rating, setRating] = useState('any');

  const { minPrice, maxPrice } = useMemo(() => {
    if (relevantHospitals.length === 0) return { minPrice: 0, maxPrice: 100000 };
    const prices = relevantHospitals.map(h => h.price);
    return {
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices)
    };
  }, [relevantHospitals]);

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  useEffect(() => {
    setFilteredHospitals(relevantHospitals);
    setPriceRange([minPrice, maxPrice]);
  }, [relevantHospitals, minPrice, maxPrice]);


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
  
  const handleFilterApply = () => {
    let hospitals = relevantHospitals;

    if (selectedState) {
        // This is a mock filter as we don't have state data in our hospital objects.
        // In a real app, you would filter by state.
        toast({ title: "State filter applied (demo)"});
    }

    if (rating !== 'any') {
        hospitals = hospitals.filter(h => h.rating >= parseInt(rating));
    }

    hospitals = hospitals.filter(h => h.price >= priceRange[0] && h.price <= priceRange[1]);

    setFilteredHospitals(hospitals);
    toast({
        title: "Filters Applied",
        description: `Found ${hospitals.length} hospitals matching your criteria.`,
    });
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
        <div className="mb-6">
            <Button variant="outline" onClick={() => router.push('/medical-tourism')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Packages
            </Button>
        </div>

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

        <div className="mb-8">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter Options
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Filter Options</AlertDialogTitle>
                        <AlertDialogDescription>
                            Find providers for this package based on your preferences.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-6 py-4">
                       <div className="space-y-4">
                            <Label className="font-semibold">Location</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <Select onValueChange={handleCountryChange} value={selectedCountry}>
                                    <SelectTrigger id="country">
                                        <SelectValue placeholder="Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map(country => (
                                            <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select onValueChange={setSelectedState} value={selectedState} disabled={!selectedCountry}>
                                    <SelectTrigger id="state">
                                        <SelectValue placeholder="State/Province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currentStates.map(state => (
                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="price-range" className="font-semibold">Price Range</Label>
                            <Slider
                                id="price-range"
                                value={priceRange}
                                min={minPrice} max={maxPrice}
                                step={1000}
                                onValueChange={(value) => setPriceRange(value as [number, number])}
                            />
                            <div className="flex items-center gap-4">
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="min-price" className="text-xs text-muted-foreground">Min price</Label>
                                    <Input
                                        id="min-price"
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                                        step={1000}
                                        min={minPrice}
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                     <Label htmlFor="max-price" className="text-xs text-muted-foreground">Max price</Label>
                                    <Input
                                        id="max-price"
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                                        step={1000}
                                    />
                                </div>
                            </div>
                        </div>
                         <div className="space-y-4">
                            <Label className="font-semibold">Rating</Label>
                            <RadioGroup defaultValue="any" className="flex items-center gap-4" value={rating} onValueChange={setRating}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="any" id="r1" />
                                    <Label htmlFor="r1">Any</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="4" id="r2" />
                                    <Label htmlFor="r2" className="flex items-center">
                                        4 <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" /> & Up
                                    </Label>
                                </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="3" id="r3" />
                                    <Label htmlFor="r3" className="flex items-center">
                                        3 <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" /> & Up
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleFilterApply}>Apply Filters</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Hospitals Offering this Package</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHospitals.map(hospital => (
                    <Card key={hospital.id} className="flex flex-col sm:flex-row overflow-hidden">
                        <div className="relative h-48 sm:h-auto sm:w-1/3 flex-shrink-0">
                            <Image src={hospital.imageUrl} alt={hospital.name} fill objectFit="cover" data-ai-hint={hospital.imageHint} />
                        </div>
                        <div className="flex flex-col flex-grow">
                            <CardHeader>
                                <CardTitle>{hospital.name}</CardTitle>
                                <CardDescription>{hospital.location}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`h-5 w-5 ${i < hospital.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                    <span className="ml-2 text-sm text-muted-foreground">({hospital.rating.toFixed(1)})</span>
                                </div>
                                <p className="font-bold text-lg mt-2">${hospital.price.toLocaleString()}</p>
                                <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                                    {hospital.pros.join(', ')}
                                </p>
                            </CardContent>
                            <CardFooter className="bg-muted/50 p-4 flex gap-2">
                                <Button variant="outline" className="w-full">View Details</Button>
                                <Button className="w-full">Book Now</Button>
                            </CardFooter>
                        </div>
                    </Card>
                ))}
                {filteredHospitals.length === 0 && (
                    <div className="md:col-span-2 text-center py-12">
                        <p className="text-muted-foreground">No hospitals match your filter criteria.</p>
                    </div>
                )}
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
