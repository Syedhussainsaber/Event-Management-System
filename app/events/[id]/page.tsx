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
      Technology: 'bg-blue-100 text-blue-700 border-blue-200',
      Business: 'bg-green-100 text-green-700 border-green-200',
      Arts: 'bg-purple-100 text-purple-700 border-purple-200',
      Sports: 'bg-orange-100 text-orange-700 border-orange-200',
      Music: 'bg-pink-100 text-pink-700 border-pink-200',
      Education: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      Other: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
          <Card className="shadow-xl border-slate-200 bg-white">
            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                    <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
                      {event.title}
                    </CardTitle>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  <CardDescription className="text-base sm:text-lg text-slate-600 leading-relaxed">
                    {event.description}
                  </CardDescription>
                </div>
                {isOrganizer && <EventActions eventId={event._id} />}
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="p-2.5 bg-white rounded-lg shadow-sm">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{formattedDate}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{formattedTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="p-2.5 bg-white rounded-lg shadow-sm">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <div className="p-2.5 bg-white rounded-lg shadow-sm">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Organized by {event.organizer.username}
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {event.organizer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                  <div className="p-2.5 bg-white rounded-lg shadow-sm">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {event.attendees.length} attending
                    </p>
                    {event.maxAttendees && (
                      <p className="text-sm text-slate-600 mt-0.5">
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
            <Card className="shadow-xl border-slate-200 bg-white">
              <CardHeader className="pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800">
                    Attendees
                    <span className="ml-2 text-lg font-semibold text-indigo-600">
                      ({event.attendees.length})
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {event.attendees.map((attendee: any) => (
                    <div key={attendee._id} className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                        {attendee.username[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 truncate">{attendee.username}</p>
                        <p className="text-sm text-slate-600 truncate">{attendee.email}</p>
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