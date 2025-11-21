"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Car, Edit, PlusCircle, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Trip, User } from "@/lib/types";
import { TripCard } from "../search/trip-card";
import { useTrips } from "@/hooks/use-trips";
import { useToast } from "@/hooks/use-toast";


interface DashboardClientProps {
    user: User;
    bookedTrips: Trip[];
    listedTrips: Trip[];
}

export function DashboardClient({ user, bookedTrips, listedTrips }: DashboardClientProps) {
  const { deleteTrip } = useTrips();
  const { toast } = useToast();

  const handleDelete = (tripId: string) => {
    deleteTrip(tripId);
    toast({
      title: "Trip Deleted",
      description: "Your trip has been removed.",
    });
  }

  return (
    <Tabs defaultValue="bookings" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-3 mb-6">
        <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        <TabsTrigger value="listings">My Listings</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      <TabsContent value="bookings">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Booked Trips</CardTitle>
            <CardDescription>
              Here are the trips you've booked.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookedTrips.length > 0 ? (
                bookedTrips.map(trip => <TripCard key={trip.id} trip={trip} />)
            ) : (
                <div className="text-center py-12">
                    <Car className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-semibold">No trips booked yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Find a ride to get started.</p>
                    <Button asChild className="mt-4">
                        <Link href="/search">Find a Ride</Link>
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="listings">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">My Listed Trips</CardTitle>
              <CardDescription>
                Manage the trips you are offering.
              </CardDescription>
            </div>
            <Button asChild>
                <Link href="/trips/create"><PlusCircle className="mr-2 h-4 w-4" />Offer New Ride</Link>
            </Button>
          </CardHeader>
          <CardContent>
             {listedTrips.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Trip</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Passengers</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listedTrips.map(trip => (
                            <TableRow key={trip.id}>
                                <TableCell className="font-medium"><Link href={`/trips/${trip.id}`} className="hover:underline">{trip.origin.name} to {trip.destination.name}</Link></TableCell>
                                <TableCell>{format(trip.departureTime, 'PP')}</TableCell>
                                <TableCell>{trip.passengers.length} / {trip.totalSeats}</TableCell>
                                <TableCell>{new Date(trip.departureTime) > new Date() ? 'Upcoming' : 'Completed'}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/trips/edit/${trip.id}`}><Edit className="h-4 w-4"/></Link>
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4"/></Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your trip
                                            and notify any passengers.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDelete(trip.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             ) : (
                <div className="text-center py-12">
                    <Car className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-semibold">No rides offered yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Offer a ride to start earning.</p>
                     <Button asChild className="mt-4">
                        <Link href="/trips/create"><PlusCircle className="mr-2 h-4 w-4" />Offer a Ride</Link>
                    </Button>
                </div>
             )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Profile Settings</CardTitle>
            <CardDescription>
              Manage your personal information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Profile editing is coming soon!</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
