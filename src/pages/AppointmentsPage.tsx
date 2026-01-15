/**
 * Appointments Page
 * Shows user's booked appointments
 */

import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/context/AppointmentContext';
import { 
  Calendar, 
  Clock, 
  Search, 
  Stethoscope, 
  CalendarX2,
  XCircle
} from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';
import { toast } from 'sonner';

export default function AppointmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const { getPatientAppointments, cancelAppointment } = useAppointments();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login First</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your appointments.
          </p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Get user's appointments
  const appointments = getPatientAppointments(user.id);

  // Sort appointments: upcoming first, then by date
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  // Handle cancel
  const handleCancel = (appointmentId: string) => {
    cancelAppointment(appointmentId);
    toast.success('Appointment cancelled');
  };

  // Get status badge
  const getStatusBadge = (appointment: typeof appointments[0]) => {
    if (appointment.status === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    const appointmentDate = parseISO(appointment.date);
    if (isPast(appointmentDate)) {
      return <Badge variant="secondary">Completed</Badge>;
    }
    return <Badge variant="default" className="bg-success">Upcoming</Badge>;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">My Appointments</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Appointments
          </h1>
          <p className="text-muted-foreground">
            View and manage your scheduled appointments
          </p>
        </div>

        {/* Appointments List */}
        {sortedAppointments.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <CalendarX2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Appointments Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't booked any appointments yet. Find a doctor and book your first appointment.
            </p>
            <Button asChild>
              <Link to="/search">
                <Search className="h-4 w-4 mr-2" />
                Find a Doctor
              </Link>
            </Button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {sortedAppointments.map((appointment) => (
              <Card key={appointment.id} className="animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Doctor Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                        {appointment.doctorName
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold">Dr. {appointment.doctorName}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" />
                          {appointment.specialization}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {format(parseISO(appointment.date), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      {getStatusBadge(appointment)}
                      {appointment.status !== 'cancelled' && 
                       !isPast(parseISO(appointment.date)) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleCancel(appointment.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Find More Doctors CTA */}
        {sortedAppointments.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/search">
                <Search className="h-4 w-4 mr-2" />
                Book Another Appointment
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
