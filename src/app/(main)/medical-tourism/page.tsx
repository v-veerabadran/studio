
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';

const packages = [
  {
    id: 'diamond',
    name: 'Diamond Package',
    price: '$25,000',
    description: 'The ultimate, all-inclusive experience with unparalleled luxury and personal care.',
    imageUrl: 'https://picsum.photos/seed/luxury-suite/600/400',
    imageHint: 'luxury hospital suite',
    features: [
      'VIP hospital suite',
      'Dedicated 24/7 personal concierge',
      'Chauffeur-driven luxury car',
      'Gourmet dining',
      'Exclusive wellness retreat access'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum Package',
    price: '$18,000',
    description: 'A premium package offering superior comfort and comprehensive medical services.',
    imageUrl: 'https://picsum.photos/seed/private-room/600/400',
    imageHint: 'modern private hospital',
    features: [
      'Private hospital room',
      'Personal care coordinator',
      'Airport & local transfers',
      'Post-operative therapy sessions'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Package',
    price: '$12,000',
    description: 'Our most popular package, balancing excellent care with great value.',
    imageUrl: 'https://picsum.photos/seed/modern-clinic/600/400',
    imageHint: 'modern clinic',
    features: [
      'Semi-private hospital room',
      'Shared care coordinator',
      'Scheduled shuttle services',
      'Standard post-operative care'
    ]
  },
  {
    id: 'silver',
    name: 'Silver Package',
    price: '$8,000',
    description: 'An essential care package covering all fundamental medical and travel needs.',
    imageUrl: 'https://picsum.photos/seed/hospital-ward/600/400',
    imageHint: 'clean hospital ward',
    features: [
      'General ward accommodation',
      'On-call support staff',
      'Basic travel assistance',
      'Essential medical care'
    ]
  }
];

const countries = [
    { name: 'United States', code: 'US', states: ['California', 'New York', 'Texas', 'Florida'] },
    { name: 'Canada', code: 'CA', states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'] },
    { name: 'United Kingdom', code: 'GB', states: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
];

export default function MedicalTourismPage() {
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');

    const handleCountryChange = (countryCode: string) => {
        setSelectedCountry(countryCode);
        setSelectedState(''); // Reset state when country changes
    }

    const currentStates = countries.find(c => c.code === selectedCountry)?.states || [];

    return (
        <div className="container py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
                    <Plane className="h-10 w-10" />
                    Medical Tourism Packages
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    World-class care, unparalleled comfort. All packages are customizable.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {packages.map(pkg => (
                    <Card key={pkg.id} className="flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/50">
                        <div className="relative h-48 w-full">
                            <Image src={pkg.imageUrl} alt={pkg.name} fill objectFit="cover" className="rounded-t-lg" data-ai-hint={pkg.imageHint} />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                            <CardDescription className="text-2xl font-bold text-primary">{pkg.price}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                           <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                            <ul className="space-y-2 text-sm">
                                {pkg.features.map(feature => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                             {pkg.id === 'diamond' && (
                                <>
                                <Separator className="my-4" />
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-muted-foreground">Customize Your Destination</h4>
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
                                </div>
                                </>
                            )}

                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/medical-tourism/${pkg.id}`}>Select Package</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
