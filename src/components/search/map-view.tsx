"use client";

import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import type { Trip } from "@/lib/types";

interface MapViewProps {
  trips: Trip[];
  hoveredTripId: string | null;
}

export function MapView({ trips, hoveredTripId }: MapViewProps) {
  // Calculate center of map
  const center = trips.length > 0
    ? { lat: trips[0].origin.lat, lng: trips[0].origin.lng }
    : { lat: 39.8283, lng: -98.5795 }; // Default to center of US

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Map
        defaultCenter={center}
        defaultZoom={trips.length > 0 ? 5 : 3}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {trips.map((trip) => (
          <AdvancedMarker
            key={trip.id}
            position={{ lat: trip.origin.lat, lng: trip.origin.lng }}
            title={trip.origin.name}
          >
            <Pin
              background={hoveredTripId === trip.id ? "#E67700" : "#1E3A8A"}
              borderColor={hoveredTripId === trip.id ? "#E67700" : "#1E3A8A"}
              glyphColor={hoveredTripId === trip.id ? "#FFFFFF" : "#FFFFFF"}
            >
              <span className="text-white font-bold">${trip.price.toFixed(0)}</span>
            </Pin>
          </AdvancedMarker>
        ))}
      </Map>
    </div>
  );
}
