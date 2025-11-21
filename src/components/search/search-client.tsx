"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import type { SearchParams, Trip } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TripCard } from "./trip-card";
import { MapView } from "./map-view";

interface SearchClientProps {
  initialTrips: Trip[];
  searchParams: SearchParams;
}

export function SearchClient({ initialTrips, searchParams }: SearchClientProps) {
  const [trips] = useState<Trip[]>(initialTrips);
  const [hoveredTripId, setHoveredTripId] = useState<string | null>(null);

  const resultsText = `${trips.length} ride${trips.length !== 1 ? 's' : ''} found`;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-full lg:w-1/2 xl:w-1/3 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="font-headline text-2xl font-semibold">
            Rides from {searchParams.origin || "anywhere"} to {searchParams.destination || "anywhere"}
          </h1>
          <div className="flex justify-between items-center mt-2">
            <p className="text-muted-foreground">{resultsText}</p>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        {trips.length > 0 ? (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  onMouseEnter={() => setHoveredTripId(trip.id)}
                  onMouseLeave={() => setHoveredTripId(null)}
                >
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-xl font-semibold">No rides found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search filters or check back later.</p>
            <Button className="mt-4">Adjust Search</Button>
          </div>
        )}
      </div>

      <div className="hidden lg:block w-1/2 xl:w-2/3 h-full">
        <MapView trips={trips} hoveredTripId={hoveredTripId} />
      </div>
    </div>
  );
}
