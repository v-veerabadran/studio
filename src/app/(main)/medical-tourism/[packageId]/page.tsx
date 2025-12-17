
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { type Hospital, type MedicalPackage, hospitalData } from '@/lib/data';
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

// Mock data, to be replaced or merged with Firestore data
const mockPackages: MedicalPackage[] = [
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
    inclusions: [
        { item: "Surgery", details: "Coronary Artery Bypass Grafting (CABG) or Valve Replacement" },
        { item: "Hospital Stay", details: "7-day stay in a private, air-conditioned room" },
        { item: "Coordinator", details: "Dedicated care coordinator available 24/7" },
        { item: "Transport", details: "Airport pickup/drop-off and all hospital transfers" },
        { item: "Meals", details: "All meals for the patient as per dietary plan" }
    ],
    itinerary: [
        { day: "1-2", activity: "Arrival, consultation with surgeon, and pre-operative tests." },
        { day: "3", activity: "Surgery day." },
        { day: "4-7", activity: "Post-operative ICU and hospital room recovery." },
        { day: "8-10", activity: "Recovery at hotel with follow-up consultation." },
        { day: "11", activity: "Departure." },
    ],
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
     inclusions: [
        { item: "Surgery", details: "Total Knee or Hip Replacement with top-tier implants" },
        { item: "Hospital Stay", details: "5-day stay in a specialized orthopedic suite" },
        { item: "Physiotherapy", details: "10 sessions of personalized post-op physiotherapy" },
        { item: "Transport", details: "Airport pickup/drop-off and all hospital transfers" },
        { item: "Accommodation", details: "5-night hotel stay for post-discharge recovery" }
    ],
    itinerary: [
        { day: "1", activity: "Arrival and consultation with orthopedic surgeon." },
        { day: "2", activity: "Surgery day." },
        { day: "3-5", activity: "In-patient recovery and start of physiotherapy." },
        { day: "6-10", activity: "Continued physiotherapy and recovery at hotel." },
        { day: "11", activity: "Final check-up and departure." },
    ],
    specialty: 'Orthopedics',
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
     inclusions: [
        { item: "Health Check", details: "Full-body preventive health screening and diagnostics" },
        { item: "Wellness Therapies", details: "Daily personalized Ayurveda and Yoga sessions" },
        { item: "Accommodation", details: "7-night stay in a luxury wellness resort with all amenities" },
        { item: "Meals", details: "All gourmet wellness meals and detox juices included" },
        { item: "Activities", details: "Guided meditation, nature walks, and wellness workshops" }
    ],
    itinerary: [
        { day: "1", activity: "Arrival, wellness consultation, and relaxation." },
        { day: "2-6", activity: "Daily Yoga, Ayurveda therapies, and wellness activities." },
        { day: "7", activity: "Final health review and departure planning." },
    ],
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
    inclusions: [
        { item: "Procedure", details: "Advanced dermatological procedure as required." },
        { item: "Hospital Stay", details: "2-day stay in a general ward." },
        { item: "Consultation", details: "Pre and post-procedure consultations." },
        { item: "Transport", details: "Scheduled shuttle for hospital visits." },
        { item: "Medication", details: "Post-procedure medication kit." }
    ],
    itinerary: [
        { day: "1", activity: "Arrival, consultation, and procedure." },
        { day: "2", activity: "Post-procedure care and observation." },
        { day: "3", activity: "Discharge and final instructions." },
        { day: "4", activity: "Departure." }
    ],
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
    inclusions: [
        { item: "Procedure", details: "Dental veneers (up to 8 teeth) and professional whitening." },
        { item: "Accommodation", details: "5-night stay in a comfortable 3-star hotel." },
        { item: "Consultation", details: "Comprehensive dental assessment and planning." },
        { item: "Transport", details: "Airport transfers and transport for all dental appointments." },
        { item: "Aftercare", details: "Follow-up check-up before departure." }
    ],
    itinerary: [
        { day: "1", activity: "Arrival, consultation, and initial prep work." },
        { day: "2-4", activity: "Main dental procedures and adjustments." },
        { day: "5", activity: "Final fitting, polishing, and final check-up." },
        { day: "6", activity: "Departure." }
    ],
    specialty: 'Dentistry'
  }
];


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
