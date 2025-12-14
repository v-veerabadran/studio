
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";
import { updateUserProfile } from "@/lib/firebase/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, FileText, BadgeCheck, History, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
});

const contactFormSchema = z.object({
    email: z.string().email(),
    phoneNumber: z.string().optional(),
});

const searchHistory = [
    { id: 1, query: "How to implement user authentication in Next.js", time: "2 hours ago" },
    { id: 2, query: "Best practices for Tailwind CSS", time: "5 hours ago" },
    { id: 3, query: "ShadCN UI components tutorial", time: "1 day ago" },
    { id: 4, query: "Firebase security rules for user profiles", time: "2 days ago" },
];

export default function AccountPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-avatar');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/account#${value}`, { scroll: false });
  };

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
        email: "",
        phoneNumber: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.displayName ?? "",
      });
      contactForm.reset({
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
      });
      setPreviewUrl(user.photoURL);
    }
  }, [user, profileForm, contactForm]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      let photoURL = user.photoURL;
      if (selectedFile) {
        toast({ title: "Note", description: "Image upload is a demo. The image is not saved." });
        photoURL = previewUrl; 
      }

      await updateUserProfile(user, { displayName: values.name, photoURL });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContactUpdate = (values: z.infer<typeof contactFormSchema>) => {
    toast({
        title: "Coming Soon!",
        description: "Updating contact information is not yet implemented.",
    });
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "AC";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="history">Search History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture & Name</CardTitle>
              <CardDescription>Update your photo and display name.</CardDescription>
            </CardHeader>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={previewUrl ?? avatarImage?.imageUrl} alt={user?.displayName ?? ""} />
                        <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <Button type="button" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Photo
                        </Button>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading || !profileForm.formState.isDirty && !selectedFile}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Manage your email and phone number.</CardDescription>
                </CardHeader>
                 <Form {...contactForm}>
                    <form onSubmit={contactForm.handleSubmit(handleContactUpdate)}>
                        <CardContent className="space-y-4">
                             <FormField
                                control={contactForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                        <div className="flex items-center gap-4">
                                            <FormControl>
                                                <Input disabled {...field} />
                                            </FormControl>
                                            {user?.emailVerified ? (
                                                <div className="flex items-center text-sm text-green-600">
                                                    <BadgeCheck className="mr-1 h-4 w-4"/> Verified
                                                </div>
                                            ) : (
                                                <Button type="button" variant="outline" size="sm">Verify</Button>
                                            )}
                                        </div>
                                     <FormMessage />
                                    </FormItem>
                                )}
                                />
                             <FormField
                                control={contactForm.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                      <div className="flex items-center gap-4">
                                        <FormControl>
                                            <Input placeholder="Your phone number" {...field} />
                                        </FormControl>
                                        {user?.phoneNumber ? (
                                             <div className="flex items-center text-sm text-green-600">
                                                <BadgeCheck className="mr-1 h-4 w-4"/> Verified
                                            </div>
                                        ) : (
                                            <Button type="button" variant="outline" size="sm">Verify</Button>
                                        )}
                                    </div>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={true}>
                                Save Contact Info
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Search History</CardTitle>
            </CardHeader>
            <CardContent>
                {searchHistory.length > 0 ? (
                    <div className="space-y-4">
                        {searchHistory.map((item, index) => (
                            <div key={item.id}>
                                <div className="flex items-start gap-4">
                                    <Search className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div className="flex-1">
                                        <p className="text-sm">{item.query}</p>
                                        <p className="text-xs">{item.time}</p>
                                    </div>
                                </div>
                                {index < searchHistory.length - 1 && <Separator className="mt-4" />}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <History className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">You have no search history yet.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
