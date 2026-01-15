/**
 * DoctorCard Component
 * Displays doctor information in a card format
 */

import { Doctor } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Generate initials for avatar
  const initials = doctor.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  // Generate a consistent color based on name
  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    'bg-success',
  ];
  const colorIndex = doctor.name.length % colors.length;

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    navigate(`/book/${doctor.id}`);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-healthcare hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div 
            className={`flex-shrink-0 w-16 h-16 rounded-full ${colors[colorIndex]} flex items-center justify-center text-xl font-bold text-primary-foreground shadow-md`}
          >
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">
              Dr. {doctor.name}
            </h3>
            
            <div className="flex items-center gap-1 mt-1">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground truncate">
                {doctor.specialization}
              </span>
            </div>

            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {doctor.location}
              </span>
            </div>
          </div>

          {/* Rating Badge */}
          <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span>{doctor.rating}</span>
          </Badge>
        </div>

        {/* Available Timings */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span>Available Timings</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {doctor.availableTimings.slice(0, 4).map((time) => (
              <Badge key={time} variant="outline" className="text-xs">
                {time}
              </Badge>
            ))}
            {doctor.availableTimings.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{doctor.availableTimings.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full"
          variant="hero"
          onClick={handleBookAppointment}
        >
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
}
