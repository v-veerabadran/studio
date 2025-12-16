
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { doctorData, type Doctor } from '@/lib/data';
import { HeartPulse, Wind, Filter, Star, Check, X, ThumbsUp, ThumbsDown, Brain, PersonStanding, Bone, Smile } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

function DoctorsPageContent() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Doctor[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const doctorId = searchParams.get('view_doctor');
    if (doctorId) {
      const allDoctors = Object.values(doctorData).flat();
      const doctor = allDoctors.find(d => d.id === doctorId);
      if (doctor) {
        setViewingDoctor(doctor);
      }
    }
  }, [searchParams]);

  const handleSelect = (e: React.MouseEvent, item: Doctor) => {
    e.stopPropagation(); // Prevent card click from firing
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
          <SheetTitle>Compare Doctors</SheetTitle>
          <SheetDescription>Side-by-side comparison of your selected doctors.</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-y-auto h-full">
            {selected.map(doctor => (
                <Card key={doctor.id}>
                    <CardHeader className="items-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint={doctor.imageHint} />
                            <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{doctor.name}</CardTitle>
                        <CardDescription>{doctor.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                         <div className="flex items-center justify-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < doctor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">({doctor.rating.toFixed(1)})</span>
                        </div>
                        <div className="text-sm space-y-1">
                            <p><strong>Experience:</strong> {doctor.experience} years</p>
                            <p className="flex items-center justify-center">
                                <strong>Board Certified:</strong> 
                                {doctor.boardCertified ? <Check className="h-4 w-4 ml-2 text-green-600" /> : <X className="h-4 w-4 ml-2 text-red-600" />}
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center justify-center"><ThumbsUp className="h-4 w-4 mr-2 text-green-600" /> Pros</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 text-left">
                                {doctor.pros.map((pro, index) => <li key={index}>{pro}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center justify-center"><ThumbsDown className="h-4 w-4 mr-2 text-red-600" /> Cons</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 text-left">
                                {doctor.cons.map((con, index) => <li key={index}>{con}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  )

  const handleCloseSheet = (open: boolean) => {
      if (!open) {
          setViewingDoctor(null);
          const newUrl = window.location.pathname + '?' + searchParams.toString().replace(/&?view_doctor=\d+/, '');
          window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
      }
  }

  const DoctorDetailSheet = ({ doctor, onOpenChange }: { doctor: Doctor | null, onOpenChange: (open: boolean) => void }) => {
    if (!doctor) return null;
    return (
        <Sheet open={!!doctor} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint={doctor.imageHint} />
                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <SheetTitle className="text-2xl">{doctor.name}</SheetTitle>
                    <SheetDescription>{doctor.specialty} at {doctor.hospital}</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-4">
                     <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < doctor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">({doctor.rating.toFixed(1)})</span>
                    </div>
                    <div className="text-sm space-y-2">
                        <p><strong>Experience:</strong> {doctor.experience} years</p>
                        <p className="flex items-center">
                            <strong>Board Certified:</strong> 
                            {doctor.boardCertified ? <Check className="h-4 w-4 ml-2 text-green-600" /> : <X className="h-4 w-4 ml-2 text-red-600" />}
                        </p>
                    </div>
                    <Separator />
                     <div>
                        <h4 className="font-semibold mb-2 flex items-center"><ThumbsUp className="h-4 w-4 mr-2 text-green-600" /> Pros</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {doctor.pros.map((pro, index) => <li key={index}>{pro}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center"><ThumbsDown className="h-4 w-4 mr-2 text-red-600" /> Cons</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {doctor.cons.map((con, index) => <li key={index}>{con}</li>)}
                        </ul>
                    </div>
                </div>
                <SheetFooter>
                    <Button asChild className="w-full">
                        <Link href={`/book-appointment?doctorId=${doctor.id}`}>Book an Appointment</Link>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
  }

  const specialties = [
    { name: 'Cardiology', icon: HeartPulse },
    { name: 'Pulmonology', icon: Wind },
    { name: 'Nephrology', icon: Filter },
    { name: 'Neurology', icon: Brain },
    { name: 'Dermatology', icon: PersonStanding },
    { name: 'Orthopedics', icon: Bone },
    { name: 'Dentistry', icon: Smile },
  ];

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Find a Doctor</h1>
        <Button variant="outline">Advanced Search</Button>
      </div>
      <Tabs defaultValue="Cardiology" className="overflow-x-auto">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
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
              {doctorData[spec.name.toLowerCase()]?.map((doctor) => (
                <Card key={doctor.id} className="text-center flex flex-col">
                  <div className="flex-grow cursor-pointer" onClick={() => setViewingDoctor(doctor)}>
                    <CardHeader className="items-center">
                      <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint={doctor.imageHint} />
                          <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <CardTitle>{doctor.name}</CardTitle>
                      <CardDescription>{doctor.hospital}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="flex items-center justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < doctor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">({doctor.rating.toFixed(1)})</span>
                      </div>
                    </CardContent>
                  </div>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={selected.find(s => s.id === doctor.id) ? 'default' : 'outline'}
                      onClick={(e) => handleSelect(e, doctor)}
                      disabled={!selected.find(s => s.id === doctor.id) && selected.length >= 3}
                    >
                      {selected.find(s => s.id === doctor.id) ? 'Selected' : 'Compare'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             {!doctorData[spec.name.toLowerCase()] || doctorData[spec.name.toLowerCase()].length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No doctors found for this specialty.</div>
            )}
          </TabsContent>
        ))}
      </Tabs>
       {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg z-50">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h3 className="font-bold">Comparing {selected.length} doctor{selected.length > 1 ? 's' : ''}</h3>
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
      <DoctorDetailSheet doctor={viewingDoctor} onOpenChange={handleCloseSheet} />
    </div>
  );
}

export default function DoctorsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DoctorsPageContent />
        </Suspense>
    )
}
