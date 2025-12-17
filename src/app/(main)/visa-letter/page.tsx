
'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { generateVisaLetter, type GenerateVisaLetterInput } from '@/ai/flows/generate-visa-letter-flow';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';

function VisaLetterContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user } = useUser();
    
    const [letter, setLetter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [inputData, setInputData] = useState<GenerateVisaLetterInput | null>(null);

    const letterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const data: GenerateVisaLetterInput = {
            patientName: searchParams.get('patientName') || '',
            patientCountry: searchParams.get('patientCountry') || '',
            passportNumber: searchParams.get('passportNumber') || '',
            treatment: searchParams.get('treatment') || '',
            hospitalName: searchParams.get('hospitalName') || '',
            hospitalLocation: searchParams.get('hospitalLocation') || '',
            surgeonName: searchParams.get('surgeonName') || '',
            estimatedStartDate: searchParams.get('estimatedStartDate') || '',
            estimatedDuration: searchParams.get('estimatedDuration') || '',
        };

        if (!data.patientName || !data.passportNumber) {
            toast({
                title: "Missing Information",
                description: "Could not generate letter due to missing patient details.",
                variant: "destructive"
            });
            router.push('/dashboard');
            return;
        }
        
        setInputData(data);
        
        const generateAndSaveLetter = async () => {
            setIsLoading(true);
            try {
                // 1. Generate the letter
                const result = await generateVisaLetter(data);
                const generatedLetter = result.visaLetter;
                setLetter(generatedLetter);
                
                // 2. Automatically save it to Firestore
                if (user && firestore) {
                    setIsSaving(true);
                    const documentsRef = collection(firestore, 'users', user.uid, 'documents');
                    await addDoc(documentsRef, {
                        title: `Medical Visa Letter for ${data.patientName}`,
                        content: generatedLetter,
                        createdAt: serverTimestamp(),
                        type: 'visa_letter'
                    });
                    toast({
                        title: "Letter Saved",
                        description: "The visa letter has been automatically saved to your Medical Records.",
                    });
                }

            } catch (error) {
                console.error("Error generating or saving visa letter:", error);
                toast({
                    title: "Operation Failed",
                    description: "There was an error generating or saving the visa letter.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
                setIsSaving(false);
            }
        };

        generateAndSaveLetter();

    }, [searchParams, router, toast, user, firestore]);

    return (
        <div className="container py-8">
            <div className="mb-6">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>AI-Generated Medical Visa Letter</CardTitle>
                    <CardDescription>This is the generated support letter for the visa application. It has been saved to your records.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">Generating your letter...</p>
                        </div>
                    ) : (
                        <div>
                             <div className="flex items-center justify-between mb-4 rounded-md border border-green-200 bg-green-50 p-4">
                                <div className='flex items-center gap-2'>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <p className="text-sm font-medium text-green-800">
                                        {isSaving ? 'Saving document...' : 'Automatically saved to Medical Records'}
                                    </p>
                                </div>
                                <Button variant="secondary" size="sm" onClick={() => router.push('/records')}>
                                    View Documents
                                </Button>
                            </div>
                            <div ref={letterRef} className="border p-8 rounded-lg bg-background font-serif text-sm leading-relaxed whitespace-pre-wrap">
                                {letter}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


export default function VisaLetterPage() {
    return (
        <Suspense fallback={<div className="container py-8 text-center">Loading...</div>}>
            <VisaLetterContent />
        </Suspense>
    )
}
