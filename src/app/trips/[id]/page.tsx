'use client';

import { TripDetailsClient } from "@/components/trips/trip-details-client";
import { useTrips } from "@/hooks/use-trips";
import { notFound } from "next/navigation";

export default function TripPage({ params }: { params: { id: string } }) {
  const { trips, loading } = useTrips();

  if (loading) {
    return <div className="container mx-auto p-4">Loading trip details...</div>
  }
  
  const trip = trips.find(t => t.id === params.id);

  if (!trip) {
    notFound();
  }
  
  const otherTripsByDriver = trips.filter(t => t.driverId === trip.driverId && t.id !== trip.id);

  return <TripDetailsClient trip={trip} otherTripsByDriver={otherTripsByDriver} />;
}
