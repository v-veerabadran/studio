'use server';
/**
 * @fileOverview A flow to generate a medical visa support letter.
 * 
 * - generateVisaLetter - A function that calls the AI flow.
 * - GenerateVisaLetterInput - The input type for the flow.
 * - GenerateVisaLetterOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateVisaLetterInputSchema = z.object({
    patientName: z.string().describe("The full name of the patient as it appears on their passport."),
    patientCountry: z.string().describe("The patient's country of citizenship."),
    passportNumber: z.string().describe("The patient's passport number."),
    treatment: z.string().describe("The name of the medical treatment or package."),
    hospitalName: z.string().describe("The name of the hospital where the treatment will take place."),
    hospitalLocation: z.string().describe("The city and country of the hospital."),
    surgeonName: z.string().describe("The name of the lead surgeon."),
    estimatedStartDate: z.string().describe("The estimated start date of the treatment."),
    estimatedDuration: z.string().describe("The estimated duration of the stay for the treatment and recovery."),
});
export type GenerateVisaLetterInput = z.infer<typeof GenerateVisaLetterInputSchema>;

const GenerateVisaLetterOutputSchema = z.object({
    visaLetter: z.string().describe("The full text of the generated medical visa support letter."),
});
export type GenerateVisaLetterOutput = z.infer<typeof GenerateVisaLetterOutputSchema>;


const generateVisaLetterFlow = ai.defineFlow(
    {
        name: 'generateVisaLetterFlow',
        inputSchema: GenerateVisaLetterInputSchema,
        outputSchema: GenerateVisaLetterOutputSchema,
    },
    async (input) => {
        const prompt = ai.definePrompt({
            name: 'generateVisaLetterPrompt',
            input: { schema: GenerateVisaLetterInputSchema },
            output: { schema: GenerateVisaLetterOutputSchema },
            prompt: `You are an administrative assistant at a world-class hospital in India. Your task is to draft a formal and professional medical visa invitation letter for an international patient.

The letter should be addressed to the respective embassy or consulate of the patient's country. It must be clear, concise, and contain all necessary information to support the patient's medical visa application.

Use the following information to draft the letter. Ensure the tone is formal and supportive. The letter must be a single block of text, with paragraphs separated by newline characters. Do not use markdown.

**Patient Information:**
- Full Name: {{{patientName}}}
- Country of Citizenship: {{{patientCountry}}}
- Passport Number: {{{passportNumber}}}

**Treatment Information:**
- Medical Procedure/Package: {{{treatment}}}
- Attending Surgeon: {{{surgeonName}}}
- Estimated Start Date: {{{estimatedStartDate}}}
- Estimated Duration of Stay (including recovery): {{{estimatedDuration}}}

**Hospital Information:**
- Hospital Name: {{{hospitalName}}}
- Hospital Location: {{{hospitalLocation}}}

**Letter Structure:**
1.  Start with a formal salutation (e.g., "To The Visa Officer, [Embassy/Consulate of Patient's Country]").
2.  State the purpose of the letter clearly: to support the medical visa application for the patient.
3.  Introduce the patient (name, passport number) and confirm they are scheduled to receive medical treatment at your hospital.
4.  Describe the medical treatment required ({{{treatment}}}).
5.  Mention the estimated dates of treatment and the required duration of stay in India.
6.  Confirm that the patient has made the initial arrangements with the hospital.
7.  State the hospital's reputation and commitment to providing the necessary medical care.
8.  Conclude with a professional closing and provide the hospital's name and the surgeon's name as the contacts.

Draft the letter now.`,
        });

        const { output } = await prompt(input);
        return output!;
    }
);


export async function generateVisaLetter(input: GenerateVisaLetterInput): Promise<GenerateVisaLetterOutput> {
    return generateVisaLetterFlow(input);
}