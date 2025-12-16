
'use client';

import { useParams, notFound } from 'next/navigation';
import { packages, allHospitals, allDoctors } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, MapPin, Stethoscope, BriefcaseMedical, CalendarDays, DollarSign, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function PackageDetailPage() {
  const params = useParams();
  const packageId = params.packageId;

  const pkg = packages.find((p) => p.id.toString() === packageId);

  if (!pkg) {
    notFound();
  }

  const { hospital, surgeon } = pkg;

  return (
    <div>
      <section className="relative h-[350px] w-full">
        <Image
          src={pkg.imageUrl}
          alt={pkg.title}
          fill
          objectFit="cover"
          data-ai-hint={pkg.imageHint}
          className="brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold">{pkg.title}</h1>
          <p className="mt-2 text-lg max-w-3xl">{pkg.description}</p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="provider">Providers</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Package Inclusions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      {pkg.inclusions.map((inclusion, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                          <div>
                            <span className="font-semibold text-foreground">{inclusion.item}:</span> {inclusion.details}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="itinerary">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Sample Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-3"></div>
                      {pkg.itinerary.map((item, index) => (
                         <div key={index} className="relative mb-6 pl-2">
                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary -translate-x-1/2"></div>
                            <p className="font-semibold">Day {item.day}</p>
                            <p className="text-muted-foreground">{item.activity}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="provider">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Partner Hospital</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                                <Image src={hospital.imageUrl} alt={hospital.name} fill objectFit="cover" data-ai-hint={hospital.imageHint} />
                             </div>
                             <h3 className="font-semibold text-lg">{hospital.name}</h3>
                             <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4"/>{hospital.location}</p>
                             <Link href={`/hospitals`}>
                                <Button variant="outline" className="w-full">View Hospital Details</Button>
                             </Link>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Lead Surgeon</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-center">
                                <Avatar className="h-32 w-32 mb-4">
                                    <AvatarImage src={surgeon.imageUrl} alt={surgeon.name} data-ai-hint={surgeon.imageHint} />
                                    <AvatarFallback>{surgeon.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                </Avatar>
                            </div>
                             <h3 className="font-semibold text-lg text-center">{surgeon.name}</h3>
                             <p className="text-sm text-muted-foreground text-center">{surgeon.specialty}</p>
                             <Link href={`/doctors?view_doctor=${surgeon.id}`}>
                                <Button variant="outline" className="w-full">View Surgeon Profile</Button>
                             </Link>
                        </CardContent>
                    </Card>
                 </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-baseline justify-between">
                    <CardTitle className="text-2xl">Book This Package</CardTitle>
                    <p className="text-xl font-bold text-primary">{pkg.price}</p>
                </div>
              </CardHeader>
              <CardContent>
                <Button size="lg" className="w-full">Start Inquiry</Button>
                <Separator className="my-4" />
                <p className="text-sm font-semibold mb-2">Package Highlights</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {pkg.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center">
                            <ListChecks className="mr-2 h-4 w-4 text-primary" />
                            <span>{highlight}</span>
                        </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
