
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { hospitalData, mockPackages } from '@/lib/data';
import type { Hospital, MedicalPackage } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Info, Star } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect, useMemo } from 'react';
import { MedicalTourismFilter } from '@/components/medical-tourism-filter';
import { filterConfigs } from '@/lib/filter-config';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';


export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();

  const packageId = params.packageId as string;
  const pkg = mockPackages.find((p) => p.id === packageId);

  const allHospitals = useMemo(() => {
    if (!pkg) return [];
    const specialtyKey = pkg.specialty.toLowerCase();
    return hospitalData[specialtyKey] || [];
  }, [pkg]);


  const packageFilterConfig = useMemo(() => {
    if (!pkg) return undefined;
    const configKey = pkg.title.split(' ')[0].toLowerCase();
    return filterConfigs[configKey];
  }, [pkg]);

  const relevantHospitals = useMemo(() => {
    if (!allHospitals || !packageFilterConfig) return [];
    
    // Pre-filter hospitals based on the package's price range
    const { min, max } = packageFilterConfig.priceRange;
    return allHospitals.filter(h => h.price >= min && h.price <= max);

  }, [allHospitals, packageFilterConfig]);
  
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setFilteredHospitals(relevantHospitals);
      setIsLoading(false);
    }, 500)
  }, [relevantHospitals]);

  if (!pkg) {
    notFound();
  }

  const getBookingUrl = (hospitalId: string) => {
    const params = new URLSearchParams({
        packageId: pkg.id,
        packageName: pkg.title,
        hospitalId: hospitalId,
    });
    return `/medical-tourism-booking?${params.toString()}`;
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
            <MedicalTourismFilter
                hospitals={relevantHospitals}
                onFilterChange={setFilteredHospitals}
                config={packageFilterConfig}
            />
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
                                <Button asChild className="w-full">
                                    <Link href={getBookingUrl(hospital.id)}>Book Now</Link>
                                </Button>
                            </CardFooter>
                        </div>
                    </Card>
                ))}
                {filteredHospitals.length === 0 && !isLoading && (
                    <div className="md:col-span-2 text-center py-12">
                        <p className="text-muted-foreground">No hospitals match your filter criteria.</p>
                    </div>
                )}
                 {isLoading && (
                    [...Array(2)].map((_, i) => (
                        <Card key={i} className="flex flex-col sm:flex-row overflow-hidden">
                            <div className="relative h-48 sm:h-auto sm:w-1/3 flex-shrink-0">
                                <Skeleton className="h-full w-full" />
                            </div>
                            <div className="flex flex-col flex-grow p-6">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2 mb-4" />
                                <Skeleton className="h-5 w-1/3 mb-2" />
                                <Skeleton className="h-6 w-1/4 mb-4" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        </Card>
                    ))
                 )}
            </div>
        </div>
    </div>
    </>
  );
}
