'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Trip, User } from '@/lib/types';
import { useAuth } from '@/lib/auth/use-auth';

const TRIPS_STORAGE_KEY = 'hopon-trips';

interface TripContextType {
  trips: Trip[];
  loading: boolean;
  addTrip: (tripData: Omit<Trip, 'id' | 'vehicleImageUrl' | 'driverRating' | 'driverName' | 'driverAvatarUrl' | 'driverId' >) => void;
  updateTrip: (updatedTrip: Trip) => void;
  deleteTrip: (tripId: string) => void;
  bookTrip: (tripId: string) => boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const storedTrips = localStorage.getItem(TRIPS_STORAGE_KEY);
      if (storedTrips) {
        const parsedTrips = JSON.parse(storedTrips, (key, value) => {
          if (key === 'departureTime') return new Date(value);
          return value;
        });
        setTrips(parsedTrips);
      } else {
        localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify([]));
        setTrips([]);
      }
    } catch (error) {
      console.error("Failed to load trips from local storage", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLocalStorage = (updatedTrips: Trip[]) => {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(updatedTrips));
    setTrips(updatedTrips);
  };

  const addTrip = useCallback((tripData: Omit<Trip, 'id' | 'vehicleImageUrl' | 'driverRating' | 'driverName' | 'driverAvatarUrl' | 'driverId' >) => {
    if (!user) return;
    const newTrip: Trip = {
      ...tripData,
      id: uuidv4(),
      driverId: user.id,
      driverName: user.name,
      driverAvatarUrl: user.avatarUrl,
      driverRating: 4.8, // Default rating
      vehicleImageUrl: 'https://images.unsplash.com/photo-1700840439827-4d9154c8b7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxzZWRhbiUyMGNhcnxlbnwwfHx8fDE3NjMwMTg5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      passengers: [],
    };
    updateLocalStorage([...trips, newTrip]);
  }, [trips, user]);

  const updateTrip = useCallback((updatedTrip: Trip) => {
    const updatedTrips = trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip);
    updateLocalStorage(updatedTrips);
  }, [trips]);

  const deleteTrip = useCallback((tripId: string) => {
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    updateLocalStorage(updatedTrips);
  }, [trips]);

  const bookTrip = useCallback((tripId: string) => {
    if (!user) return false;
    
    const trip = trips.find(t => t.id === tripId);
    if (!trip || trip.availableSeats === 0 || trip.passengers.some(p => p.id === user.id) || trip.driverId === user.id) {
      return false;
    }

    const passengerInfo = { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl };

    const updatedTrip = {
      ...trip,
      availableSeats: trip.availableSeats - 1,
      passengers: [...trip.passengers, passengerInfo],
    };
    updateTrip(updatedTrip);
    return true;
  }, [trips, user, updateTrip]);


  const value = { trips, loading, addTrip, updateTrip, deleteTrip, bookTrip };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
