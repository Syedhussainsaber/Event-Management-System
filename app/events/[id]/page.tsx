import { getEventById } from '@/app/lib/actions/event.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/app/components/Navbar';
import { Calendar, MapPin, User, Users, Edit, Trash2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import JoinLeaveButton from '@/app/components/JoinLeaveButton';
import EventActions from '@/app/components/EventActions';

export default async function EventDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { id } = await params;
  const event = await getEventById(id);
  const session = await getServerSession();

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isOrganizer = session?.user?.email === event.organizer.email.toString();
  const isAttending = session?.user?.email && event.attendees.some(
    (attendee: any) => attendee.email.toString() === session.user.email
  );


  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: 'bg-blue-100 text-blue-800',
      Business: 'bg-green-100 text-green-800',
      Arts: 'bg-purple-100 text-purple-800',
      Sports: 'bg-orange-100 text-orange-800',
      Music: 'bg-pink-100 text-pink-800',
      Education: 'bg-indigo-100 text-indigo-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-3xl">{event.title}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  <CardDescription className="text-lg">
                    {event.description}
                  </CardDescription>
                </div>
                {isOrganizer && <EventActions eventId={event._id} />}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">{formattedDate}</p>
                    <p className="text-sm text-gray-600">{formattedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <p className="font-semibold">{event.location}</p>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">
                      Organized by {event.organizer.username}
                    </p>
                    <p className="text-sm text-gray-600">
                      {event.organizer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">
                      {event.attendees.length} attending
                    </p>
                    {event.maxAttendees && (
                      <p className="text-sm text-gray-600">
                        Max: {event.maxAttendees}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {session?.user && !isOrganizer && (
                <JoinLeaveButton 
                  eventId={event._id} 
                  isAttending={!!isAttending}
                  isFull={event.maxAttendees ? event.attendees.length >= event.maxAttendees : false}
                />
              )}
            </CardContent>
          </Card>

          {event.attendees.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attendees ({event.attendees.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {event.attendees.map((attendee: any) => (
                    <div key={attendee._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {attendee.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{attendee.username}</p>
                        <p className="text-sm text-gray-600">{attendee.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}