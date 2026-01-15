/**
 * Footer Component
 * Simple footer with copyright and links
 */

import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and tagline */}
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-primary text-primary" />
            <span className="font-semibold text-foreground">Smart HealthCare</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Smart HealthCare Interface. 
            <span className="hidden sm:inline"> Symptom-Consulting Doctor and Appointment Booking System.</span>
          </p>

          {/* Links */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
