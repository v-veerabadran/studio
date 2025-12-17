
'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, ArrowLeft } from 'lucide-react';
import { generateVisaLetter, type GenerateVisaLetterInput } from '@/ai/flows/generate-visa-letter-flow';
import { useReactToPrint } from 'react-to-print';

function VisaLetterContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [letter, setLetter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
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
        
        const generateLetter = async () => {
            setIsLoading(true);
            try {
                const result = await generateVisaLetter(data);
                setLetter(result.visaLetter);
            } catch (error) {
                console.error("Error generating visa letter:", error);
                toast({
                    title: "Generation Failed",
                    description: "There was an error generating the visa letter. Please try again.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        generateLetter();

    }, [searchParams, router, toast]);

    const handlePrint = useReactToPrint({
        content: () => letterRef.current,
        documentTitle: `Visa_Invitation_Letter_${inputData?.patientName.replace(/\s/g, '_')}`
    });
    
    const handleDownload = () => {
        if (!letterRef.current) return;
        const blob = new Blob([letterRef.current.innerText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Visa_Invitation_Letter_${inputData?.patientName.replace(/\s/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: 'Downloaded', description: 'The letter has been downloaded as a text file.' });
    };

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
                    <CardDescription>This is the generated support letter for the visa application. Review and print it.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">Generating your letter...</p>
                        </div>
                    ) : (
                        <div>
                             <div className="flex gap-2 mb-4 print:hidden">
                                <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                                <Button onClick={handleDownload} variant="outline"><Download className="mr-2 h-4 w-4" /> Download</Button>
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
