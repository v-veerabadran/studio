"use client";

import { useUser } from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { User, BarChart2, Settings, LifeBuoy } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();

  const features = [
    {
      title: "Manage Profile",
      description: "View and edit your personal information.",
      icon: <User className="mb-4 h-8 w-8 text-primary" />,
      href: "/account",
      id: "manage-profile"
    },
    {
      title: "Analytics",
      description: "Track your activity and view insights.",
      icon: <BarChart2 className="mb-4 h-8 w-8 text-primary" />,
      href: "#",
      id: "analytics"
    },
    {
      title: "Settings",
      description: "Customize your application preferences.",
      icon: <Settings className="mb-4 h-8 w-8 text-primary" />,
      href: "#",
      id: "settings"
    },
    {
      title: "Help & Support",
      description: "Get assistance and find answers to your questions.",
      icon: <LifeBuoy className="mb-4 h-8 w-8 text-primary" />,
      href: "#",
      id: "help-support"
    },
  ];

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.displayName?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground mb-8">
          Here's a quick overview of your account.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.id} className="group">
              <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
                <CardHeader>
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
