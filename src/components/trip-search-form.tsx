"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowRight, CalendarIcon, MapPin } from "lucide-react";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  origin: z.string().min(2, { message: "Origin is required." }),
  destination: z.string().min(2, { message: "Destination is required." }),
  date: z.date().optional(),
});

function PlaceAutocomplete({ field, placeholder, ...props }: { field: any, placeholder: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const map = useMap();

  useEffect(() => {
    if (!map || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["address_components", "geometry", "icon", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.name) {
        field.onChange(place.name);
      }
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [map, field]);

  return <Input placeholder={placeholder} {...field} {...props} ref={inputRef} />;
}

export function TripSearchForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams();
    params.set("origin", values.origin);
    params.set("destination", values.destination);
    if (values.date) {
      params.set("date", values.date.toISOString().split("T")[0]);
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start">
          <div className="md:col-span-4">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <PlaceAutocomplete field={field} placeholder="Leaving from..." className="pl-10 h-12 text-base" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="hidden md:flex items-center justify-center h-12">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="md:col-span-4">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <PlaceAutocomplete field={field} placeholder="Going to..." className="pl-10 h-12 text-base" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-12 text-base justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-5 w-5" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
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
          </div>

          <div className="md:col-span-1 w-full">
            <Button type="submit" className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 text-base">
              Search
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
