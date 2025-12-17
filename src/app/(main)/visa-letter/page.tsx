
'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Download } from 'lucide-react';
import { generateVisaLetter, type GenerateVisaLetterInput } from '@/ai/flows/generate-visa-letter-flow';
import jsPDF from 'jspdf';

function VisaLetterContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [letter, setLetter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [inputData, setInputData] = useState<GenerateVisaLetterInput | null>(null);

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
                    description: "There was an error generating the visa letter.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        generateLetter();

    }, [searchParams, router, toast]);

    const handleDownloadPdf = () => {
        if (!letter || !inputData) return;
        const pdf = new jsPDF();
        pdf.setFont('times', 'normal');
        pdf.setFontSize(12);
        const margin = 15;
        const maxWidth = 210 - margin * 2;
        const lines = pdf.splitTextToSize(letter, maxWidth);
        pdf.text(lines, margin, margin);
        pdf.save(`Visa_Letter_${inputData.patientName.replace(/\s/g, '_')}.pdf`);
    };

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-6">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                {!isLoading && (
                    <Button onClick={handleDownloadPdf}>
                        <Download className="mr-2 h-4 w-4" />
                        Save as PDF
                    </Button>
                )}
            </div>
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>AI-Generated Medical Visa Letter</CardTitle>
                    <CardDescription>This is the generated support letter for the visa application.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">Generating your letter...</p>
                        </div>
                    ) : (
                        <div className="border p-8 rounded-lg bg-background font-serif text-sm leading-relaxed whitespace-pre-wrap">
                            {letter}
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
