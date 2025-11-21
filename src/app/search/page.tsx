'use client';

import { SearchClient } from "@/components/search/search-client";
import { useTrips } from "@/hooks/use-trips";
import { SearchParams } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { isSameDay } from "date-fns";

export default function SearchPage() {
  const { trips, loading } = useTrips();
  const searchParams = useSearchParams();

  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date');

  const filteredTrips = useMemo(() => {
    if (!trips) return [];
    
    return trips.filter(trip => {
      const originMatch = origin ? trip.origin.name.toLowerCase().includes(origin.toLowerCase()) : true;
      const destinationMatch = destination ? trip.destination.name.toLowerCase().includes(destination.toLowerCase()) : true;
      const dateMatch = date ? isSameDay(trip.departureTime, new Date(date)) : true;
      
      return originMatch && destinationMatch && dateMatch;
    });
  }, [trips, origin, destination, date]);

  const params: SearchParams = {
    origin,
    destination,
    date,
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading trips...</div>
  }

  return (
    <SearchClient 
      initialTrips={filteredTrips} 
      searchParams={params}
    />
  );
}
