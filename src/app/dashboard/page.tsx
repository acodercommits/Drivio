'use client';

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { useAuth } from "@/lib/auth/use-auth";
import { useTrips } from "@/hooks/use-trips";
import { useEffect, useState } from "react";
import { Trip } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { trips, loading: tripsLoading } = useTrips();
  const [bookedTrips, setBookedTrips] = useState<Trip[]>([]);
  const [listedTrips, setListedTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (user && trips) {
      setBookedTrips(trips.filter(trip => trip.passengers.some(p => p.id === user.id)));
      setListedTrips(trips.filter(trip => trip.driverId === user.id));
    }
  }, [user, trips]);

  if (authLoading || tripsLoading) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <h1 className="text-4xl font-bold font-headline">Loading...</h1>
        </div>
    );
  }

  if (!user) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <h1 className="text-4xl font-bold font-headline">Please sign in</h1>
            <p className="text-muted-foreground">You need to be logged in to view your dashboard.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
            <h1 className="text-4xl font-bold font-headline">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">Manage your rides and trips all in one place.</p>
        </div>
        <DashboardClient
            user={user}
            bookedTrips={bookedTrips}
            listedTrips={listedTrips}
        />
    </div>
  );
}
