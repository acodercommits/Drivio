import { CreateTripForm } from "@/components/trips/create-trip-form";

export default function CreateTripPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 md:px-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold font-headline">Offer a Ride</h1>
        <p className="text-muted-foreground">
          Share your journey and earn money. Fill out the details below to list your trip.
        </p>
      </div>
      <div className="mt-8">
        <CreateTripForm />
      </div>
    </div>
  );
}
