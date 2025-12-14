"use client";

import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, User, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Logo } from "@/components/logo";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

function ToggleSidebarButton() {
    const { state, toggleSidebar } = useSidebar();
    return (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
            {state === 'expanded' ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
    )
}


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden md:block w-64 border-r p-4 space-y-4">
            <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7" />
                <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2 pt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
        <div className="flex-1">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                    <div className="mr-8 hidden md:flex">
                        <Skeleton className="h-7 w-32" />
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <Skeleton className="h-10 w-64" />
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </main>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
          <ToggleSidebarButton />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" passHref>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                >
                  <BarChart2 />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/account" passHref>
                <SidebarMenuButton
                  isActive={pathname === "/account"}
                  tooltip="My Account"
                >
                  <User />
                  <span>My Account</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
