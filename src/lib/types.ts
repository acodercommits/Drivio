export type Trip = {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatarUrl: string;
  driverRating: number;
  vehicle: string;
  vehicleImageUrl: string;
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  departureTime: Date;
  availableSeats: number;
  totalSeats: number;
  price: number;
  passengers: {id: string, name: string, avatarUrl: string}[];
};

export type User = {
  id: string;
  name:string;
  email: string;
  avatarUrl: string;
  password?: string;
};

export type SearchParams = {
  origin?: string;
  destination?: string;
  date?: string;
}

export type Message = {
    id: string;
    tripId: string;
    userId: string;
    name: string;
    avatarUrl: string;
    text: string;
    timestamp: number;
};
