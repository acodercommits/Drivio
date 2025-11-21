import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car, ShieldCheck, Users } from "lucide-react";

import { TripSearchForm } from "@/components/trip-search-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  const features = [
    {
      icon: <Car className="h-10 w-10 text-primary" />,
      title: "Find Your Ride",
      description: "Easily search for trips that match your schedule and destination. Hop on with reliable drivers.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: "Safe & Secure",
      description: "Verified profiles, ratings, and secure payments ensure a trustworthy experience for everyone.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Build Connections",
      description: "Share your journey, meet new people, and make your travel more social and enjoyable.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Share Your Journey
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-slate-200">
            Affordable, convenient, and friendly rides are just a few clicks away.
          </p>
          <div className="mt-8 w-full max-w-4xl">
            <TripSearchForm />
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold">Why HopOn?</h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">Discover a new way to travel that's better for your wallet and the planet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-headline text-2xl pt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
           <h2 className="font-headline text-3xl md:text-4xl font-semibold">Ready to Get Started?</h2>
           <p className="mt-2 max-w-xl mx-auto">
             Whether you're a driver with empty seats or a passenger looking for a ride, HopOn is for you.
           </p>
           <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
             <Button asChild size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
               <Link href="/search">Find a Ride <ArrowRight className="ml-2" /></Link>
             </Button>
             <Button asChild size="lg" variant="outline" className="text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/10 hover:text-primary-foreground">
               <Link href="/trips/create">Offer a Ride</Link>
             </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
