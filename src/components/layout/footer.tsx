import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Logo } from "../shared/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Your ride-sharing companion for cheaper, greener travel.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/search" className="text-sm hover:text-primary">Find a Ride</Link></li>
              <li><Link href="/trips/create" className="text-sm hover:text-primary">Offer a Ride</Link></li>
              <li><Link href="/dashboard" className="text-sm hover:text-primary">Dashboard</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-primary">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} HopOn Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
