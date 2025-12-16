
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { packages } from '@/lib/data';

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
