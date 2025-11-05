import { getAllEvents } from './lib/actions/event.actions';
import EventCard from './components/EventCard';
import Navbar from './components/Navbar';
import SearchFilter from './components/SearchFilter';
import { CalendarDays } from 'lucide-react';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const {category, search} = await searchParams;
  const events = await getAllEvents({
    category: category,
    search: search,
  });


  console.log(events);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <CalendarDays className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Upcoming Events
            </h1>
          </div>
          <p className="text-slate-600 text-base sm:text-lg ml-0 sm:ml-14">
            Discover and attend amazing events in your area
          </p>
        </div>

        <div className="mb-8 lg:mb-10">
          <SearchFilter />
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 lg:py-24">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8 lg:p-12">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-slate-100 rounded-full">
                  <CalendarDays className="h-12 w-12 text-slate-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Events Found</h3>
              <p className="text-slate-600 text-base">
                Try adjusting your search or filters to discover events.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {events.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}