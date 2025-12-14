"use client";

import Link from "next/link";
import { UserNav } from "@/components/user-nav";
import { useUser } from "@/firebase";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { History } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="icon">
                      <Link href="/account#history">
                        <History />
                        <span className="sr-only">Search History</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search History</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <UserNav />
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
