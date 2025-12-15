"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { hospitalData, type Hospital } from '@/lib/data';
import { HeartPulse, Wind, Filter, Star, Check, X, ThumbsUp, ThumbsDown, LocateFixed, Brain, PersonStanding, Bone, Smile, Map } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function HospitalsPage() {
  const [selected, setSelected] = useState<Hospital[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [viewingHospital, setViewingHospital] = useState<Hospital | null>(null);

  const handleSelect = (e: React.MouseEvent, item: Hospital) => {
    e.stopPropagation();
    setSelected((prev) => {
      if (prev.find((i) => i.id === item.id)) {
        return prev.filter((i) => i.id !== item.id);
      }
      if (prev.length < 3) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const ComparisonSheet = () => (
     <Sheet open={isComparing} onOpenChange={setIsComparing}>
      <SheetContent side="bottom" className="h-4/5">
        <SheetHeader>
          <SheetTitle>Compare Hospitals</SheetTitle>
          <SheetDescription>Side-by-side comparison of your selected hospitals.</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-y-auto h-full">
            {selected.map(hospital => (
                <Card key={hospital.id}>
                    <CardHeader>
                        <div className="relative h-40 w-full mb-4 rounded-t-lg overflow-hidden">
                             <Image src={hospital.imageUrl} alt={hospital.name} fill objectFit="cover" data-ai-hint={hospital.imageHint}/>
                        </div>
                        <CardTitle>{hospital.name}</CardTitle>
                        <CardDescription>{hospital.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < hospital.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">({hospital.rating.toFixed(1)})</span>
                        </div>
                         <div className="text-sm space-y-1">
                            <p><strong>Specialty:</strong> {hospital.specialty}</p>
                            <p className="flex items-center">
                                <strong>Emergency Services:</strong> 
                                {hospital.emergency ? <Check className="h-4 w-4 ml-2 text-green-600" /> : <X className="h-4 w-4 ml-2 text-red-600" />}
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center"><ThumbsUp className="h-4 w-4 mr-2 text-green-600" /> Pros</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 text-left">
                                {hospital.pros.map((pro, index) => <li key={index}>{pro}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center"><ThumbsDown className="h-4 w-4 mr-2 text-red-600" /> Cons</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 text-left">
                                {hospital.cons.map((con, index) => <li key={index}>{con}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  )

  const HospitalDetailSheet = ({ hospital, onOpenChange }: { hospital: Hospital | null, onOpenChange: (open: boolean) => void }) => {
    if (!hospital) return null;
    return (
        <Sheet open={!!hospital} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                        <Image src={hospital.imageUrl} alt={hospital.name} fill objectFit="cover" data-ai-hint={hospital.imageHint}/>
                    </div>
                    <SheetTitle className="text-2xl">{hospital.name}</SheetTitle>
                    <SheetDescription>{hospital.location}</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-4">
                     <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < hospital.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">({hospital.rating.toFixed(1)})</span>
                    </div>
                     <div className="text-sm space-y-2">
                        <p><strong>Primary Specialty:</strong> {hospital.specialty}</p>
                        <p className="flex items-center">
                            <strong>24/7 Emergency Services:</strong> 
                            {hospital.emergency ? <Check className="h-4 w-4 ml-2 text-green-600" /> : <X className="h-4 w-4 ml-2 text-red-600" />}
                        </p>
                    </div>
                    <Separator />
                     <div>
                        <h4 className="font-semibold mb-2 flex items-center"><ThumbsUp className="h-4 w-4 mr-2 text-green-600" /> Pros</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {hospital.pros.map((pro, index) => <li key={index}>{pro}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center"><ThumbsDown className="h-4 w-4 mr-2 text-red-600" /> Cons</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {hospital.cons.map((con, index) => <li key={index}>{con}</li>)}
                        </ul>
                    </div>
                    <Button className="w-full mt-4">
                        <LocateFixed className="mr-2 h-4 w-4"/>
                        Get Directions
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
  }

  const specialties = [
    { name: 'Cardiology', icon: HeartPulse, data: hospitalData.cardiology },
    { name: 'Pulmonology', icon: Wind, data: hospitalData.pulmonology },
    { name: 'Nephrology', icon: Filter, data: hospitalData.nephrology },
    { name: 'Neurology', icon: Brain, data: hospitalData.neurology },
    { name: 'Dermatology', icon: PersonStanding, data: hospitalData.dermatology },
    { name: 'Orthopedics', icon: Bone, data: hospitalData.orthopedics },
    { name: 'Dentistry', icon: Smile, data: hospitalData.dentistry },
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Find a Hospital</h1>
        <Button variant="outline">Advanced Search</Button>
      </div>
      <Tabs defaultValue="Cardiology" className="overflow-x-auto">
        <TabsList className="grid w-full grid-cols-7">
          {specialties.map((spec) => (
            <TabsTrigger key={spec.name} value={spec.name}>
              <spec.icon className="mr-2 h-4 w-4" />
              {spec.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {specialties.map((spec) => (
          <TabsContent key={spec.name} value={spec.name}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {spec.data.map((hospital) => (
                <Card key={hospital.id} className="flex flex-col">
                  <div className="flex-grow cursor-pointer" onClick={() => setViewingHospital(hospital)}>
                    <CardHeader>
                       <div className="relative h-40 w-full mb-4 rounded-t-lg overflow-hidden">
                          <Image src={hospital.imageUrl} alt={hospital.name} fill objectFit="cover" data-ai-hint={hospital.imageHint}/>
                      </div>
                      <CardTitle>{hospital.name}</CardTitle>
                      <CardDescription>{hospital.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < hospital.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">({hospital.rating.toFixed(1)})</span>
                      </div>
                    </CardContent>
                  </div>
                  <CardFooter className="flex gap-2">
                    <Button
                      className="w-full"
                      variant={selected.find(s => s.id === hospital.id) ? 'default' : 'outline'}
                      onClick={(e) => handleSelect(e, hospital)}
                      disabled={!selected.find(s => s.id === hospital.id) && selected.length >= 3}
                    >
                      {selected.find(s => s.id === hospital.id) ? 'Selected' : 'Compare'}
                    </Button>
                    <Button variant="outline" size="icon">
                        <Map className="h-4 w-4"/>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
       {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg z-50">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h3 className="font-bold">Comparing {selected.length} hospital{selected.length > 1 ? 's' : ''}</h3>
              <p className="text-sm text-muted-foreground max-w-md truncate">
                {selected.map(h => h.name).join(', ')}
              </p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="secondary" onClick={() => setSelected([])}>Clear</Button>
                <Button onClick={() => setIsComparing(true)} disabled={selected.length < 2}>Compare</Button>
            </div>
          </div>
        </div>
      )}
      <ComparisonSheet />
      <HospitalDetailSheet hospital={viewingHospital} onOpenChange={(open) => !open && setViewingHospital(null)} />
    </div>
  );
}
