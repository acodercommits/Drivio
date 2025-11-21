"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTrips } from "@/hooks/use-trips";
import { useAuth } from "@/lib/auth/use-auth";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarIcon, Car, DollarSign, MapPin, Users } from "lucide-react";
import { Trip } from "@/lib/types";

const createTripSchema = z.object({
  originName: z.string().min(3, "Origin is required"),
  destinationName: z.string().min(3, "Destination is required"),
  departureDate: z.date({ required_error: "Departure date is required." }),
  departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  availableSeats: z.coerce.number().min(1, "At least 1 seat must be available").max(8),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  vehicle: z.string().min(3, "Vehicle information is required"),
  tripDetails: z.string().optional(),
});

type Place = {
  name: string;
  lat: number;
  lng: number;
}

function PlaceAutocomplete({ field, placeholder, onPlaceSelect, ...props }: { field: any, placeholder: string, onPlaceSelect: (place: Place | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const map = useMap();

  useEffect(() => {
    if (!map || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["geometry.location", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.name) {
        field.onChange(place.name);
        onPlaceSelect({
            name: place.name,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        });
      } else {
        onPlaceSelect(null);
      }
    });
    
    const pacContainer = document.querySelector('.pac-container');
    if (pacContainer) {
        pacContainer.classList.add('z-[9999]');
    }

    return () => {
      const pacContainers = document.querySelectorAll('.pac-container');
      pacContainers.forEach(container => container.remove());
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [map, field, onPlaceSelect]);

  return <Input placeholder={placeholder} {...field} {...props} ref={inputRef} />;
}

interface CreateTripFormProps {
  trip?: Trip;
}


export function CreateTripForm({ trip }: CreateTripFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { addTrip, updateTrip } = useTrips();
  const { user } = useAuth();
  
  const [origin, setOrigin] = useState<Place | null>(trip ? trip.origin : null);
  const [destination, setDestination] = useState<Place | null>(trip ? trip.destination : null);

  const isEditMode = !!trip;

  const form = useForm<z.infer<typeof createTripSchema>>({
    resolver: zodResolver(createTripSchema),
    defaultValues: isEditMode && trip ? {
      originName: trip.origin.name,
      destinationName: trip.destination.name,
      departureDate: new Date(trip.departureTime),
      departureTime: format(new Date(trip.departureTime), "HH:mm"),
      availableSeats: trip.availableSeats,
      price: trip.price,
      vehicle: trip.vehicle,
      tripDetails: "", // You may need to add this to your Trip type
    } : {
      originName: "",
      destinationName: "",
      departureTime: "09:00",
      availableSeats: 2,
      price: 20,
      vehicle: "",
      tripDetails: "",
    },
  });

  function onSubmit(values: z.infer<typeof createTripSchema>) {
    if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to create a trip." });
        return;
    }
    if (!origin || !destination) {
        toast({ variant: "destructive", title: "Invalid Location", description: "Please select a valid origin and destination from the suggestions." });
        return;
    }

    const [hours, minutes] = values.departureTime.split(':').map(Number);
    const departureDateTime = new Date(values.departureDate);
    departureDateTime.setHours(hours, minutes);

    const tripData = {
        vehicle: values.vehicle,
        origin: origin,
        destination: destination,
        departureTime: departureDateTime,
        availableSeats: values.availableSeats,
        totalSeats: values.availableSeats,
        price: values.price,
    };

    if (isEditMode && trip) {
      updateTrip({ ...trip, ...tripData });
       toast({ title: "Trip Updated", description: "Your trip has been successfully updated." });
    } else {
      addTrip(tripData);
      toast({ title: "Ride Published!", description: "Your trip is now visible to passengers." });
    }
    router.push("/dashboard");
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="originName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <PlaceAutocomplete 
                            field={field} 
                            placeholder="e.g., San Francisco, CA" 
                            className="pl-10"
                            onPlaceSelect={setOrigin}
                         />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                     <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <PlaceAutocomplete 
                            field={field} 
                            placeholder="e.g., Los Angeles, CA" 
                            className="pl-10"
                            onPlaceSelect={setDestination}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Departure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="availableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Seats</FormLabel>
                     <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" min="1" max="8" className="pl-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Seat</FormLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" min="0" step="1" placeholder="e.g., 25" className="pl-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Information</FormLabel>
                  <div className="relative">
                    <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g., White Toyota Prius 2022" className="pl-10" {...field} />
                    </FormControl>
                  </div>
                  <FormDescription>Make, model, color, and year.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tripDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I can pick you up from the station. Only small bags, please."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any extra information for passengers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto" size="lg">
                {isEditMode ? 'Update Ride' : 'Publish Ride'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
