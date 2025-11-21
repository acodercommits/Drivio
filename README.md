# HopOn - A Modern Ride-Sharing Application

HopOn is a feature-rich, single-page application that provides a modern and intuitive platform for carpooling and ride-sharing. Built with a cutting-edge tech stack, it offers a seamless experience for both drivers offering rides and passengers looking for a convenient way to travel.

This application is designed to be fully functional without any backend setup. It uses the browser's **Local Storage** for all data persistence, making it easy to run and test locally.

## ✨ Core Features

- **Full User Authentication**: Secure sign-up and login system that persists user sessions in the browser.
- **Dynamic Trip Search**: Users can search for available rides based on origin, destination, and date.
- **Interactive Map View**: Search results are displayed on an interactive map, showing ride prices and locations.
- **Offer a Ride**: Drivers can easily create new trip listings with details like route, time, price, and available seats.
- **Trip Booking System**: Passengers can book a seat on a trip with a single click. The number of available seats is updated in real-time.
- **Personalized Dashboard**: A dedicated dashboard for logged-in users to view and manage their booked trips and their own ride listings.
- **Edit & Delete Trips**: Drivers have full control to edit or delete the rides they have offered.
- **Live Trip Chat**: Once a passenger is booked on a trip, they can communicate with the driver and other passengers in a real-time chat window.
- **Google Places Autocomplete**: Location inputs are enhanced with Google Places suggestions for a better user experience.
- **Responsive Design**: A beautiful and functional UI that works seamlessly across desktop and mobile devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
- **Data Persistence**: Browser Local Storage
- **Mapping**: [Google Maps Platform](https://developers.google.com/maps)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or a compatible package manager

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   ```
2. **Navigate to the project directory:**
   ```sh
   cd hopon
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```

### Running the Application

1. **Set up your environment variables:**
   Create a file named `.env.local` in the root of the project and add your Google Maps API key. Make sure the "Places API" is enabled in your Google Cloud project.
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```

3. **Open the application:**
   Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.
