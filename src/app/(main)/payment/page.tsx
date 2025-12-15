
"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { allDoctors, type Doctor } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreditCard, CalendarIcon, Lock, User, Building, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const paymentSchema = z.object({
  cardNumber: z.string().refine((val) => /^\d{16}$/.test(val), {
    message: "Card number must be 16 digits.",
  }),
  cardName: z.string().min(2, { message: "Name on card is required." }),
  expiryDate: z.string().refine((val) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
    message: "Expiry date must be in MM/YY format.",
  }),
  cvv: z.string().refine((val) => /^\d{3,4}$/.test(val), {
    message: "CVV must be 3 or 4 digits.",
  }),
});

function PaymentPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const doctorId = searchParams.get('doctorId');
    const dateStr = searchParams.get('date');
    const time = searchParams.get('time');
    const reason = searchParams.get('reason');
    const type = searchParams.get('type');

    const doctor: Doctor | undefined = allDoctors.find(d => d.id === parseInt(doctorId || ''));
    const date = dateStr ? new Date(dateStr) : null;
    
    const form = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            cardNumber: "",
            cardName: "",
            expiryDate: "",
            cvv: "",
        },
    });

    function onSubmit(values: z.infer<typeof paymentSchema>) {
        console.log(values);
        toast({
            title: "Payment Successful!",
            description: "Your appointment has been confirmed.",
        });
        router.push('/appointments');
    }

    if (!doctor || !date || !time) {
        return (
            <div className="container py-8 text-center">
                <h1 className="text-2xl font-bold">Invalid Appointment Details</h1>
                <p className="text-muted-foreground">Could not load appointment details. Please try booking again.</p>
                <Button onClick={() => router.push('/book-appointment')} className="mt-4">Go to Booking</Button>
            </div>
        )
    }

    return (
        <div className="container py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Confirm & Pay</h1>
                <p className="text-muted-foreground">Finalize your appointment by completing the payment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>Enter your card information. All transactions are secure.</CardDescription>
                    </CardHeader>
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="cardNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Card Number</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="0000 0000 0000 0000" {...field} className="pl-10" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="cardName"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Name on Card</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="John Doe" {...field} className="pl-10" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="expiryDate"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                            <FormLabel>Expiry Date</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="MM/YY" {...field} className="pl-10" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cvv"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                            <FormLabel>CVV</FormLabel>
                                            <FormControl>
                                                 <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="123" {...field} className="pl-10" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" size="lg">Pay & Confirm Appointment</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle>Appointment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={doctor.imageUrl} alt={doctor.name} data-ai-hint={doctor.imageHint} />
                                <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-lg">{doctor.name}</p>
                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-medium">{format(date, "PPP")}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Time:</span>
                                <span className="font-medium">{time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Type:</span>
                                <span className="font-medium capitalize flex items-center gap-2">
                                     {type === 'in-person' ? <Building className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                                     {type}
                                </span>
                            </div>
                             {reason && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Reason:</span>
                                    <span className="font-medium text-right truncate max-w-[180px]">{reason}</span>
                                </div>
                             )}
                        </div>
                        <Separator />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Consultation Fee:</span>
                                <span className="font-medium">$150.00</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Booking Fee:</span>
                                <span className="font-medium">$5.00</span>
                            </div>
                        </div>
                         <Separator />
                         <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>$155.00</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="container py-8 text-center">Loading Payment Details...</div>}>
            <PaymentPageContent />
        </Suspense>
    )
}
