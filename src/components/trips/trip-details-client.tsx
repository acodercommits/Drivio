"use client";

import { format } from "date-fns";
import { ArrowLeft, Car, Clock, MessageSquare, ShieldCheck, Star, Users } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { type Trip } from "@/lib/types";
import { MapView } from "../search/map-view";
import { ChatWindow } from "../chat/chat-window";
import { TripCard } from "../search/trip-card";
import { useAuth } from "@/lib/auth/use-auth";
import { useTrips } from "@/hooks/use-trips";
import { useToast } from "@/hooks/use-toast";

interface TripDetailsClientProps {
  trip: Trip;
  otherTripsByDriver: Trip[];
}

export function TripDetailsClient({ trip: initialTrip, otherTripsByDriver }: TripDetailsClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { trips, bookTrip } = useTrips();
  const { toast } = useToast();
  
  // Use live trip data from context, fallback to initial prop
  const trip = trips.find(t => t.id === initialTrip.id) || initialTrip;

  if (!trip) {
      notFound();
      return null;
  }

  const isPassenger = user ? trip.passengers.some(p => p.id === user.id) : false;
  const isDriver = user ? trip.driverId === user.id : false;
  const isBooked = isPassenger || isDriver;

  const handleBooking = () => {
    if (!user) {
      toast({ variant: "destructive", title: "Please log in", description: "You need to be logged in to book a trip."});
      router.push('/login');
      return;
    }

    if (bookTrip(trip.id)) {
      toast({ title: "Booking Successful!", description: "You've booked a seat on this trip." });
    } else {
      toast({ variant: "destructive", title: "Booking Failed", description: "This trip might be full, you are the driver, or you've already booked it." });
    }
  };
  
  const canBook = !isDriver && !isPassenger && trip.availableSeats > 0;

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 md:px-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to search
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Trip Info Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-3xl">{trip.origin.name} to {trip.destination.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">{format(new Date(trip.departureTime), "EEEE, MMMM d, yyyy")} at {format(new Date(trip.departureTime), 'p')}</p>
                </div>
                <div className="text-right">
                  <p className="font-headline font-bold text-4xl text-primary">${trip.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">per seat</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="h-64 md:h-96 w-full rounded-lg overflow-hidden">
                    <MapView trips={[trip]} hoveredTripId={null} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-secondary p-4 rounded-lg">
                        <Clock className="mx-auto h-6 w-6 text-primary mb-2" />
                        <p className="font-semibold">{format(new Date(trip.departureTime), 'p')}</p>
                        <p className="text-sm text-muted-foreground">Departure</p>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg">
                        <Users className="mx-auto h-6 w-6 text-primary mb-2" />
                        <p className="font-semibold">{trip.availableSeats} / {trip.totalSeats}</p>
                        <p className="text-sm text-muted-foreground">Seats Left</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <Car className="mx-auto h-6 w-6 text-primary mb-2" />
                        <p className="font-semibold truncate">{trip.vehicle}</p>
                        <p className="text-sm text-muted-foreground">Vehicle</p>
                    </div>
                </div>
            </CardContent>
          </Card>
          
          {/* Passengers and Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Passengers ({trip.passengers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {trip.passengers.map(p => (
                  <TooltipProvider key={p.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar>
                          <AvatarImage src={p.avatarUrl} alt={p.name} />
                          <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{p.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {trip.passengers.length === 0 && <p className="text-muted-foreground">No passengers have booked yet.</p>}
              </div>
              {isBooked && (
                <>
                  <Separator className="my-6" />
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><MessageSquare className="mr-2 h-5 w-5"/>Trip Chat</h3>
                  <ChatWindow tripId={trip.id} />
                </>
              )}
            </CardContent>
          </Card>

           {otherTripsByDriver.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">More trips by {trip.driverName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {otherTripsByDriver.map(otherTrip => (
                        <TripCard key={otherTrip.id} trip={otherTrip} />
                    ))}
                </CardContent>
            </Card>
           )}

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Driver Card */}
          <Card>
            <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/20">
                    <AvatarImage src={trip.driverAvatarUrl} alt={trip.driverName} />
                    <AvatarFallback className="text-3xl">{trip.driverName.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline text-2xl">{trip.driverName}</CardTitle>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold">{trip.driverRating.toFixed(1)}</span>
                    <span>(52 reviews)</span>
                </div>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" disabled>View Profile</Button>
            </CardContent>
          </Card>
          
          {/* Booking Card */}
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                {isDriver ? "Your Trip" : isPassenger ? "You're Booked!" : "Book Your Seat"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Price per seat</span>
                    <span className="font-bold text-2xl">${trip.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Available seats</span>
                    <span className="font-bold text-2xl">{trip.availableSeats}</span>
                </div>
                <Separator />
                 <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">${trip.price.toFixed(2)}</span>
                </div>
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!canBook} onClick={handleBooking}>
                    {isDriver ? 'Manage Trip' : isPassenger ? 'View Booking' : trip.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                    <ShieldCheck className="inline h-3 w-3 mr-1" />
                    You can cancel for free up to 24 hours before departure.
                </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
