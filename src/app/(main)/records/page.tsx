
'use client';

import { useMemoFirebase } from '@/firebase/provider';
import { useCollection, useUser } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Upload } from 'lucide-react';
import { format } from 'date-fns';
import type { Document } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import jsPDF from 'jspdf';

export default function RecordsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const documentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'documents'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: documents, isLoading } = useCollection<Document>(documentsQuery);

  const handleDownloadPdf = (doc: Document) => {
    const pdf = new jsPDF();
    pdf.setFont('times', 'normal');
    pdf.setFontSize(12);
    const margin = 15;
    const maxWidth = 210 - margin * 2;
    const lines = pdf.splitTextToSize(doc.content, maxWidth);
    pdf.text(lines, margin, margin);
    pdf.save(`${doc.title.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Medical Records</h1>
        <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
          <CardDescription>View and manage your uploaded and generated documents.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : documents && documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Title</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
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
  );
}
