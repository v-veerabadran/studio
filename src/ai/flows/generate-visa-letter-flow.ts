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

The letter must be formatted professionally, including a letterhead, date, recipient address, a clear subject line, and a formal closing. The tone should be authoritative yet supportive.

Use the following information to draft the letter. The letter must be a single block of text, with paragraphs separated by newline characters. Do not use markdown.

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
1.  **Letterhead:**
    - [Your Hospital Logo - Placeholder]
    - {{{hospitalName}}}
    - {{{hospitalLocation}}}
    - Phone: [Hospital Phone Number] | Email: [Hospital Email]

2.  **Date:** [Current Date]

3.  **Recipient Address:**
    - The Visa Officer
    - Embassy/Consulate of {{{patientCountry}}}
    - [City of Embassy]

4.  **Subject Line:** "Subject: Medical Visa Invitation for Mr./Ms. {{{patientName}}}, Passport No: {{{passportNumber}}}"

5.  **Body Paragraphs:**
    - Start with a formal salutation (e.g., "Dear Visa Officer,").
    - **Paragraph 1:** Clearly state the purpose of the letter: to certify that the patient is scheduled for medical treatment at your facility. Introduce the patient by full name and passport number.
    - **Paragraph 2:** Detail the medical treatment required ({{{treatment}}}) and mention the attending surgeon ({{{surgeonName}}}).
    - **Paragraph 3:** Specify the estimated start date ({{{estimatedStartDate}}}) and the total estimated duration of stay ({{{estimatedDuration}}}) required for the treatment and recovery period in India.
    - **Paragraph 4:** Confirm that the hospital takes full responsibility for the patient's medical care during their stay and that the patient has made the necessary financial arrangements.
    - **Paragraph 5:** Briefly state the hospital's reputation as a leading medical institution.

6.  **Closing:**
    - Conclude with a professional closing (e.g., "Sincerely,").
    - [Signature - Placeholder]
    - [Name of Authorized Signatory, e.g., Head of International Patients Dept.]
    - {{{hospitalName}}}

Draft the letter now.`,
        });

        const { output } = await prompt(input);
        return output!;
    }
);


export async function generateVisaLetter(input: GenerateVisaLetterInput): Promise<GenerateVisaLetterOutput> {
    return generateVisaLetterFlow(input);
}
