
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { packages } from '@/lib/data';
import Link from 'next/link';

export default function MedicalTourismPage() {
  return (
    <div>
      <section className="relative h-[400px] w-full">
        <Image
          src="https://picsum.photos/seed/india-tourism/1200/400"
          alt="Medical tourism to India"
          fill
          objectFit="cover"
          data-ai-hint="India landmark"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">
            World-Class Medical Travel to India
          </h1>
          <p className="mt-4 max-w-2xl text-lg">
            Access affordable, high-quality healthcare from internationally
            accredited hospitals and renowned medical experts.
          </p>
        </div>
      </section>

      <div className="container py-12">
        <section className="text-center">
          <h2 className="text-3xl font-bold">Your Health Journey, Simplified</h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
            We manage every detail of your medical travel, from coordinating
            with top hospitals and surgeons to arranging your travel and
            accommodation. Our dedicated team ensures a seamless and
            stress-free experience, allowing you to focus solely on your
            health and recovery.
          </p>
        </section>

        <section className="mt-12">
          <h3 className="mb-8 text-center text-2xl font-bold">
            Featured Medical Packages
          </h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className="flex flex-col overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.title}
                    fill
                    objectFit="cover"
                    data-ai-hint={pkg.imageHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{pkg.title}</CardTitle>
                  <CardDescription className="pt-2">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {pkg.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRight className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/medical-tourism/${pkg.id}`}>Learn More & Inquire</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
