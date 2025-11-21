'use client';

import { CreateTripForm } from "@/components/trips/create-trip-form";
import { useTrips } from "@/hooks/use-trips";
import { notFound } from "next/navigation";

export default function EditTripPage({ params }: { params: { id: string } }) {
  const { trips, loading } = useTrips();
  const trip = trips.find(t => t.id === params.id);

  if (loading) {
      return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!trip) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 md:px-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold font-headline">Edit Your Ride</h1>
        <p className="text-muted-foreground">
          Update the details of your trip below.
        </p>
      </div>
      <div className="mt-8">
        <CreateTripForm trip={trip} />
      </div>
    </div>
  );
}
