
'use client';

import { useMemoFirebase } from '@/firebase/provider';
import { useCollection, useUser } from '@/firebase';
import { addDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Upload, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Document } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function RecordsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState<{ content: string; fileName: string } | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');

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
    // The content might be a long string without natural newlines.
    // splitTextToSize will wrap the text within the specified width.
    const lines = pdf.splitTextToSize(doc.content, maxWidth);
    pdf.text(lines, margin, margin);
    pdf.save(`${doc.title.replace(/\s/g, '_')}.pdf`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // We'll read the file as text. This is suitable for .txt, .md, etc.
    // For binary files like PDFs or images, a different approach (like Cloud Storage) is needed.
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, "")); // Use filename without extension as default title
      setUploadData({ content, fileName: file.name });
    };
    reader.onerror = () => {
        toast({
            title: "Failed to Read File",
            description: "There was an error reading the selected file.",
            variant: "destructive"
        });
    }
    reader.readAsText(file);

    // Reset the file input value to allow uploading the same file again
    event.target.value = '';
  };
  
  const handleConfirmUpload = async () => {
    if (!uploadData || !documentTitle || !user || !firestore) {
        toast({ title: "Error", description: "Could not upload document. Missing data.", variant: "destructive" });
        return;
    }
    setIsUploading(true);

    try {
        const documentsRef = collection(firestore, 'users', user.uid, 'documents');
        await addDoc(documentsRef, {
            title: documentTitle,
            content: uploadData.content,
            createdAt: serverTimestamp(),
            type: 'other' // A general type for uploaded docs
        });
        toast({
            title: "Document Uploaded",
            description: `"${documentTitle}" has been saved to your records.`,
        });
    } catch (error) {
        console.error("Error uploading document:", error);
        toast({
            title: "Upload Failed",
            description: "There was an error saving your document.",
            variant: "destructive"
        });
    } finally {
        setIsUploading(false);
        setUploadData(null);
        setDocumentTitle('');
    }
  }


  return (
    <>
    <div className="container py-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".txt,.md,text/plain" // Accept text-based files
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Medical Records</h1>
        <Button onClick={handleUploadClick}>
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
     <AlertDialog open={!!uploadData} onOpenChange={() => setUploadData(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Save New Document</AlertDialogTitle>
            <AlertDialogDescription>
                Give your document a title. The content from "{uploadData?.fileName}" will be saved.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-2 py-4">
                <Label htmlFor="doc-title">Document Title</Label>
                <Input 
                    id="doc-title"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    placeholder="e.g., Lab Report from City Clinic"
                />
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmUpload} disabled={isUploading || !documentTitle}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Document
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
