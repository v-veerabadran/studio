
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { MedicalPackage } from '@/lib/types';

// This is a mock list. In a real app, you might fetch this from a CMS or database.
const packages: MedicalPackage[] = [
  {
    id: '1',
    title: 'Diamond Package',
    description: 'The ultimate, all-inclusive experience with unparalleled luxury and personal care in cardiac surgery.',
    imageUrl: 'https://picsum.photos/seed/luxury-suite/600/400',
    imageHint: 'luxury hospital suite',
    price: '$25,000',
    features: [
      'VIP hospital suite',
      'Dedicated 24/7 personal concierge',
      'Chauffeur-driven luxury car',
      'Gourmet dining',
      'Exclusive wellness retreat access'
    ],
    inclusions: [],
    itinerary: [],
    specialty: 'Cardiology'
  },
  {
    id: '2',
    title: 'Platinum Package',
    description: 'A premium package offering superior comfort and comprehensive orthopedic services.',
    imageUrl: 'https://picsum.photos/seed/private-room/600/400',
    imageHint: 'modern private hospital',
    price: '$18,000',
    features: [
      'Private hospital room',
      'Personal care coordinator',
      'Airport & local transfers',
      'Post-operative therapy sessions'
    ],
    inclusions: [],
    itinerary: [],
    specialty: 'Orthopedics'
  },
  {
    id: '3',
    title: 'Gold Package',
    description: 'Our most popular package, balancing excellent neurological care with great value.',
    imageUrl: 'https://picsum.photos/seed/modern-clinic/600/400',
    imageHint: 'modern clinic',
    price: '$12,000',
    features: [
      'Semi-private hospital room',
      'Shared care coordinator',
      'Scheduled shuttle services',
      'Standard post-operative care'
    ],
    inclusions: [],
    itinerary: [],
    specialty: 'Neurology'
  },
  {
    id: '4',
    title: 'Silver Package',
    description: 'An essential care package covering all fundamental dermatology and travel needs.',
    imageUrl: 'https://picsum.photos/seed/hospital-ward/600/400',
    imageHint: 'clean hospital ward',
    price: '$8,000',
    features: [
      'General ward accommodation',
      'On-call support staff',
      'Basic travel assistance',
      'Essential medical care'
    ],
    inclusions: [],
    itinerary: [],
    specialty: 'Dermatology'
  },
   {
    id: '5',
    title: 'Dental Dreams Package',
    description: 'A complete dental makeover package including cosmetic procedures and essential care.',
    imageUrl: 'https://picsum.photos/seed/dental-clinic/600/400',
    imageHint: 'dental clinic',
    price: '$5,000',
    features: [
      'Cosmetic Dentistry (Veneers/Whitening)',
      'Full mouth check-up & cleaning',
      'Painless procedures with modern tech',
      'Includes 3-star hotel stay'
    ],
    inclusions: [],
    itinerary: [],
    specialty: 'Dentistry'
  }
];


export default function MedicalTourismPage() {

    return (
        <div className="container py-8">
            <div className="text-center mb-8">
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
                    <Link key={pkg.id} href={`/medical-tourism/${pkg.id}`} className="block h-full">
                        <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/50">
                            <div className="relative h-48 w-full">
                                <Image src={pkg.imageUrl} alt={pkg.title} fill style={{objectFit:"cover"}} className="rounded-t-lg" data-ai-hint={pkg.imageHint} />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl">{pkg.title}</CardTitle>
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
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" tabIndex={-1}>Select Package</Button>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
