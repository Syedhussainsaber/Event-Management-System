import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Users } from 'lucide-react';

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    maxAttendees?: number;
    attendees: any[];
    organizer: {
      username: string;
    };
  };
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

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
    <Card className="hover:shadow-xl transition-all duration-300 border-slate-200 bg-white hover:scale-[1.02] group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {event.title}
          </CardTitle>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>
        <CardDescription className="line-clamp-2 text-slate-600 leading-relaxed">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Calendar className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-purple-50 rounded-lg">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
            <span className="font-medium">{event.location}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-slate-100 rounded-lg">
              <User className="h-4 w-4 text-slate-600" />
            </div>
            <span className="font-medium">Organized by {event?.organizer?.username}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="font-medium">
              {event.attendees.length} attending
              {event.maxAttendees && ` / ${event.maxAttendees} max`}
            </span>
          </div>
        </div>
        <Link href={`/events/${event._id}`}>
          <Button className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}