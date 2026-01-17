/**
 * Booking Page
 * Allows patients to book an appointment with a specific doctor
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useDoctor } from '@/hooks/useDoctors';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/context/AppointmentContext';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Star, 
  Stethoscope,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

export default function BookingPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { bookAppointment } = useAppointments();

  // Get doctor data from database
  const { doctor, loading: loadingDoctor } = useDoctor(doctorId || '');

  // State for booking
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login First</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to book an appointment.
          </p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Show loading state
  if (loadingDoctor) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading doctor information...</p>
        </div>
      </Layout>
    );
  }

  // Show error if doctor not found
  if (!doctor) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Doctor Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The doctor you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/search">Find Doctors</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Generate initials for avatar
  const initials = doctor.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  // Handle booking confirmation
  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    setIsBooking(true);

    // Simulate booking delay
    setTimeout(() => {
      bookAppointment({
        patientId: user!.id,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
      });

      setIsBooking(false);
      setIsBooked(true);
      toast.success('Appointment booked successfully!');
    }, 1000);
  };

  // Show success screen
  if (isBooked) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Appointment Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your appointment with Dr. {doctor.name} has been booked for{' '}
              <strong>{format(selectedDate!, 'MMMM d, yyyy')}</strong> at{' '}
              <strong>{selectedTime}</strong>.
            </p>
            <Card className="text-left mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold">Dr. {doctor.name}</p>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/appointments">View My Appointments</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/search">Find More Doctors</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Info Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                    {initials}
                  </div>
                  <div>
                    <CardTitle>Dr. {doctor.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Stethoscope className="h-4 w-4" />
                      {doctor.specialization}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  <span>{doctor.rating} Rating</span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Available Timings
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {doctor.availableTimings.map((time) => (
                      <Badge key={time} variant="outline" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Select Date & Time
                </CardTitle>
                <CardDescription>
                  Choose your preferred appointment date and time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <div>
                    <h4 className="font-medium mb-4">Select Date</h4>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border pointer-events-auto"
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h4 className="font-medium mb-4">Select Time</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {doctor.availableTimings.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? 'default' : 'outline'}
                          className="justify-start"
                          onClick={() => setSelectedTime(time)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                {selectedDate && selectedTime && (
                  <div className="mt-8 p-4 bg-muted rounded-lg animate-fade-in">
                    <h4 className="font-medium mb-2">Booking Summary</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Doctor:</strong> Dr. {doctor.name}</p>
                      <p><strong>Date:</strong> {format(selectedDate, 'MMMM d, yyyy')}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>
                      <p><strong>Location:</strong> {doctor.location}</p>
                    </div>
                  </div>
                )}

                {/* Confirm Button */}
                <Button
                  className="w-full mt-6"
                  size="lg"
                  variant="gradient"
                  disabled={!selectedDate || !selectedTime || isBooking}
                  onClick={handleBooking}
                >
                  {isBooking ? 'Booking...' : 'Confirm Appointment'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
