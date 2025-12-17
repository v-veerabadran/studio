
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import type { Document } from '@/lib/types';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

const dummyDocuments: Document[] = [
    {
        id: '1',
        title: 'Medical Visa Letter for John Doe',
        content: 'This is a sample visa letter for John Doe regarding medical treatment...',
        createdAt: new Date().toISOString(),
        type: 'visa_letter'
    },
    {
        id: '2',
        title: 'Lab Report - Blood Test',
        content: 'Patient: John Doe\nDate: 2024-07-15\nResults:\n- Hemoglobin: 14.5 g/dL\n- White Blood Cell Count: 7,500/mcL\n- Platelets: 250,000/mcL',
        createdAt: '2024-07-15T10:30:00Z',
        type: 'lab_report'
    },
    {
        id: '3',
        title: 'Discharge Summary - Apollo Hospital',
        content: 'Patient was admitted for cardiac observation and discharged in stable condition.',
        createdAt: '2024-06-20T16:00:00Z',
        type: 'other'
    }
];


export default function RecordsPage() {
  const { toast } = useToast();

  const handleDownloadPdf = (doc: Document) => {
    try {
        const pdf = new jsPDF();
        pdf.setFont('times', 'normal');
        pdf.setFontSize(12);
        const margin = 15;
        const maxWidth = 210 - margin * 2;
        const lines = pdf.splitTextToSize(doc.content, maxWidth);
        pdf.text(lines, margin, margin);
        pdf.save(`${doc.title.replace(/\s/g, '_')}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
            title: "PDF Generation Failed",
            description: "There was an error creating the PDF for this document.",
            variant: "destructive"
        });
    }
  };


  return (
    <>
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Medical Records</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
          <CardDescription>View and manage your uploaded and generated documents.</CardDescription>
        </CardHeader>
        <CardContent>
          {dummyDocuments && dummyDocuments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Title</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {doc.title}
                    </TableCell>
                    <TableCell>{doc.createdAt ? format(new Date(doc.createdAt), 'PPP') : 'Date not available'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(doc)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">You haven't saved any documents yet.</p>
              <p className="text-sm text-muted-foreground">Generated visa letters will appear here automatically.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
