
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const packages = [
  {
    id: 'diamond',
    name: 'Diamond Package',
    price: '$25,000',
    description: 'The ultimate, all-inclusive experience with unparalleled luxury and personal care.',
    imageUrl: 'https://picsum.photos/seed/diamond-package/600/400',
    imageHint: 'luxury suite',
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
    imageUrl: 'https://picsum.photos/seed/platinum-package/600/400',
    imageHint: 'private room',
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
    imageUrl: 'https://picsum.photos/seed/gold-package/600/400',
    imageHint: 'hospital room',
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
    imageUrl: 'https://picsum.photos/seed/silver-package/600/400',
    imageHint: 'clean room',
    features: [
      'General ward accommodation',
      'On-call support staff',
      'Basic travel assistance',
      'Essential medical care'
    ]
  }
];

export default function MedicalTourismPage() {

    return (
        <div className="container py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Medical Tourism Packages</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Choose a package that best suits your needs. All packages are customizable.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {packages.map(pkg => (
                    <Card key={pkg.id} className="flex flex-col">
                        <div className="relative h-48 w-full">
                            <Image src={pkg.imageUrl} alt={pkg.name} fill objectFit="cover" className="rounded-t-lg" data-ai-hint={pkg.imageHint} />
                        </div>
                        <CardHeader>
                            <CardTitle>{pkg.name}</CardTitle>
                            <CardDescription className="text-2xl font-bold text-primary">{pkg.price}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
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
