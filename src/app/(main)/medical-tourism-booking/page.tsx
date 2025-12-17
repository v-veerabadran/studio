'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Plane, User, Users, FileText, Heart, ShieldCheck, Mail, CalendarIcon as CalendarIconLucid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { hospitalData, mockPackages } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { countries } from '@/lib/countries';
import { Combobox } from '@/components/ui/combobox';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import type { Dayjs } from 'dayjs';
import { Calendar } from '@/components/ui/calendar';

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email(),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  passportNumber: z.string().min(6, 'A valid passport number is required.'),
  nationality: z.string().min(2, 'Nationality is required.'),
  
  companionName: z.string().optional(),
  companionRelationship: z.string().optional(),

  purposeOfVisit: z.string().min(10, 'Please briefly describe the purpose of your visit.'),
  medicalIssues: z.string().optional(),

  visaAssistance: z.boolean().default(false),
});

function MedicalTourismBookingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPackage, setShowPackage] = useState(true);

    const packageId = searchParams.get('packageId');
    const hospitalId = searchParams.get('hospitalId');

    const pkg = mockPackages.find(p => p.id === packageId);
    const allHospitals = Object.values(hospitalData).flat();
    const hospital = allHospitals.find(h => h.id === hospitalId);

    const form = useForm<z.infer<typeof bookingSchema>>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            fullName: user?.displayName || '',
            email: user?.email || '',
            visaAssistance: false,
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                fullName: user.displayName || '',
                email: user.email || '',
                dateOfBirth: undefined,
                passportNumber: '',
                nationality: '',
                companionName: '',
                companionRelationship: '',
                purposeOfVisit: '',
                medicalIssues: '',
                visaAssistance: false,
            });
        }
    }, [user, form]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPackage(false);
        }, 10000); // 10 seconds

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, []);

    async function onSubmit(values: z.infer<typeof bookingSchema>) {
        setIsLoading(true);
        console.log("Form Submitted", values);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: "Booking Request Submitted",
            description: "Our team will get back to you within 24 hours to confirm your arrangements.",
        });

        if (values.visaAssistance) {
            const visaParams = new URLSearchParams({
                patientName: values.fullName,
                patientCountry: values.nationality,
                passportNumber: values.passportNumber,
                treatment: pkg?.title || 'Medical Treatment',
                hospitalName: hospital?.name || 'Partner Hospital',
                hospitalLocation: hospital?.location || 'India',
                surgeonName: `Specialist at ${hospital?.name}`,
                estimatedStartDate: format(new Date(), 'yyyy-MM-dd'), // Placeholder
                estimatedDuration: 'Approximately 2-3 weeks' // Placeholder
            });
            router.push(`/visa-letter?${visaParams.toString()}`);
        } else {
            router.push('/dashboard');
        }
        
        setIsLoading(false);
    }

    if (!pkg || !hospital) {
        return (
            <div className="container py-8 text-center">
                <p className="text-muted-foreground">Booking details not found. Please select a package and hospital first.</p>
                <Button onClick={() => router.push('/medical-tourism')} className="mt-4">
                    Back to Packages
                </Button>
            </div>
        )
    }
    
    const countryOptions = countries.map(country => ({ value: country.name, label: country.name }));


    return (
        <div className="container py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
                    <Plane className="h-10 w-10" />
                    Medical Travel Booking
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    You're one step away from your world-class treatment journey.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className={cn("transition-all duration-500", showPackage ? "lg:col-span-2" : "lg:col-span-3")}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><User className="text-primary"/> Patient Information</CardTitle>
                                    <CardDescription>Please provide the patient's details as they appear on the passport.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="fullName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                         <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl><Input type="email" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                     </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dateOfBirth"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                <FormLabel>Date of Birth</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIconLucid className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField control={form.control} name="passportNumber" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Passport Number</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="nationality" render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Nationality</FormLabel>
                                                 <Combobox
                                                    options={countryOptions}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select nationality..."
                                                    searchPlaceholder="Search nationality..."
                                                    noResultsText="No nationality found."
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Users className="text-primary"/> Travel Companion (Optional)</CardTitle>
                                    <CardDescription>Details of the person accompanying the patient.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="companionName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Companion's Full Name</FormLabel>
                                                <FormControl><Input {...field} placeholder="e.g., Jane Doe" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="companionRelationship" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Relationship to Patient</FormLabel>
                                                <FormControl><Input {...field} placeholder="e.g., Spouse, Sibling" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Heart className="text-primary"/> Medical Information</CardTitle>
                                    <CardDescription>Please provide a summary of your medical needs.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <FormField control={form.control} name="purposeOfVisit" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Purpose of Visit / Primary Medical Condition</FormLabel>
                                            <FormControl><Textarea {...field} placeholder="e.g., Seeking consultation for knee pain, scheduled for cardiac surgery." /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                      <FormField control={form.control} name="medicalIssues" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pre-existing Conditions or Allergies (Optional)</FormLabel>
                                            <FormControl><Textarea {...field} placeholder="e.g., Allergic to penicillin, History of diabetes." /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><FileText className="text-primary"/> Additional Services</CardTitle>
                                </CardHeader>
                                 <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="visaAssistance"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Request Visa Assistance</FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Need an invitation letter for your medical visa? We can generate one for you.
                                                </p>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            </FormItem>
                                        )}
                                        />
                                </CardContent>
                            </Card>
                            
                             <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    'Submit Booking Request'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
                {showPackage && (
                <div className="space-y-6">
                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle>Your Selected Package</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             <div className="font-bold text-lg text-primary">{pkg.title}</div>
                             <p className="text-sm">{pkg.description}</p>
                             <Separator />
                             <p className="font-semibold">{hospital.name}</p>
                             <p className="text-sm text-muted-foreground">{hospital.location}</p>
                             <Separator />
                             <div className="text-2xl font-bold">{pkg.price}</div>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs text-muted-foreground">Final price will be confirmed after medical evaluation.</p>
                        </CardFooter>
                    </Card>
                </div>
                )}
            </div>
        </div>
    );
}

export default function MedicalTourismBookingPage() {
    return (
        <Suspense fallback={<div className="container py-8 text-center">Loading Booking Form...</div>}>
            <MedicalTourismBookingForm />
        </Suspense>
    )
}
