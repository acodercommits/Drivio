import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Clock, Star, Users, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { type Trip } from "@/lib/types";

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Link href={`/trips/${trip.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow duration-300">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{format(trip.departureTime, 'h:mm a')}</span>
              </div>
              <Badge variant="secondary">{trip.availableSeats} seats left</Badge>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <div className="w-px h-6 bg-border" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium truncate">{trip.origin.name}</p>
                <p className="text-muted-foreground truncate">{trip.destination.name}</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={trip.driverAvatarUrl} />
                      <AvatarFallback>{trip.driverName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{trip.driverName}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{trip.driverRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={trip.driverAvatarUrl} />
                            <AvatarFallback>{trip.driverName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold">{trip.driverName}</h4>
                            <p className="text-sm text-muted-foreground">{trip.vehicle}</p>
                            <div className="flex items-center pt-1">
                                <Star className="mr-1 h-4 w-4 text-amber-500 fill-amber-500" />
                                <span className="text-xs text-muted-foreground">{trip.driverRating.toFixed(1)} rating</span>
                            </div>
                        </div>
                    </div>
                </HoverCardContent>
              </HoverCard>

              <div className="text-right">
                <p className="font-headline font-bold text-2xl text-primary">${trip.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">per seat</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
