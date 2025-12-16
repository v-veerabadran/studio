
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { packages, allHospitals, allDoctors } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, MapPin, Stethoscope, BriefcaseMedical, CalendarDays, DollarSign, ListChecks, FileText, Loader2, Printer } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateVisaLetter } from '@/ai/flows/generate-visa-letter-flow';
import { Textarea } from '@/components/ui/textarea';


export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.packageId;
  
  // This page is now deprecated, redirect to the main medical tourism page.
  if (typeof window !== 'undefined') {
    router.replace('/medical-tourism');
  }

  return (
    <div className="container py-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
      <p className="mt-4 text-muted-foreground">Redirecting...</p>
    </div>
  );
}
