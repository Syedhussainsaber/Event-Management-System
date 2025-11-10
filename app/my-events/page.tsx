import { getUserEvents, getUserAttendingEvents } from '../lib/actions/event.actions';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, User } from 'lucide-react';

export default async function MyEventsPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect('/login');
  }

  const [organizedEvents, attendingEvents] = await Promise.all([
    getUserEvents(session.user.email),
    getUserAttendingEvents(session.user.email),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <CalendarDays className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Events
            </h1>
          </div>
        </div>

        <div className="space-y-10 lg:space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Events I'm Organizing
                <span className="ml-2 text-lg font-semibold text-indigo-600">
                  ({organizedEvents.length})
                </span>
              </h2>
            </div>
            {organizedEvents.length === 0 ? (
              <Card className="shadow-md border-slate-200 bg-white">
                <CardContent className="py-12">
                  <div className="text-center max-w-md mx-auto">
                    <div className="mb-4 inline-flex p-4 bg-slate-100 rounded-full">
                      <User className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-base">
                      You haven't created any events yet. Start organizing your first event!
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {organizedEvents?.map((event: any) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Events I'm Attending
                <span className="ml-2 text-lg font-semibold text-purple-600">
                  ({attendingEvents.length})
                </span>
              </h2>
            </div>
            {attendingEvents.length === 0 ? (
              <Card className="shadow-md border-slate-200 bg-white">
                <CardContent className="py-12">
                  <div className="text-center max-w-md mx-auto">
                    <div className="mb-4 inline-flex p-4 bg-slate-100 rounded-full">
                      <Users className="h-10 w-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-base">
                      You haven't joined any events yet. Explore events and register to attend!
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {attendingEvents?.map((event: any) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}