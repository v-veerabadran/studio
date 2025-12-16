"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';

export default function MedicalTourismPage() {

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Medical Tourism</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Travel Itinerary</CardTitle>
                        <CardDescription>Follow your seamless journey from home to hospital.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {/* This card is intentionally left empty as requested */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Accommodation</CardTitle>
                        <CardDescription>Details about your reserved hotel.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative h-48 w-full rounded-lg overflow-hidden">
                            <Image src="https://picsum.photos/seed/hotel1/600/400" alt="Hotel exterior" fill objectFit="cover" data-ai-hint="luxury hotel" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Grand Metropolis Hotel</h3>
                             <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                                <span className="ml-2 text-xs text-muted-foreground">(4.5)</span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your comfortable stay includes complimentary breakfast and transport to the hospital.
                        </p>
                        <Button variant="outline" className="w-full">View Hotel Details</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
