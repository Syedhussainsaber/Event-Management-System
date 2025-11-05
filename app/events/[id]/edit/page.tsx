import { getEventById, updateEventAction } from '@/app/lib/actions/event.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/app/components/Navbar';
import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { CalendarDays, FileText, MapPin, Users, Tag, Clock, Edit } from 'lucide-react';

export default async function EditEventPage({ 
  params 
}: { 
  params: { id: string } 
}) {

  const {id} = await params;
  const event = await getEventById(id);
  const session = await getServerSession();

  if (!event) {
    notFound();
  }

  if (!session?.user?.email || event.organizer.email.toString() !== session.user.email) {
    redirect('/');
  }

  async function handleUpdateEvent(formData: FormData) {
    'use server';
    const result = await updateEventAction(id, formData);
    if (result.success) {
      redirect(`/events/${id}`);
    }
  }

  const categories = ['Technology', 'Business', 'Arts', 'Sports', 'Music', 'Education', 'Other'];
  const eventDate = new Date(event.date).toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Edit className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Edit Event
            </h1>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto shadow-xl border-slate-200 bg-white">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800">
              Event Details
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Update the details of your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleUpdateEvent} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-slate-700 font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  Event Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={event.title}
                  required
                  className="h-11 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-slate-700 font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={event.description}
                  rows={4}
                  required
                  className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="date" className="text-slate-700 font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    Event Date & Time
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="datetime-local"
                    defaultValue={eventDate}
                    required
                    className="h-11 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-slate-700 font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4 text-indigo-600" />
                    Category
                  </Label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={event.category}
                    className="w-full h-11 px-4 border border-slate-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-colors bg-white text-slate-700"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="location" className="text-slate-700 font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={event.location}
                  required
                  className="h-11 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="maxAttendees" className="text-slate-700 font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" />
                  Max Attendees <span className="text-slate-500 font-normal text-sm">(Optional)</span>
                </Label>
                <Input
                  id="maxAttendees"
                  name="maxAttendees"
                  type="number"
                  min="1"
                  defaultValue={event.maxAttendees || ''}
                  className="h-11 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                />
                <p className="text-sm text-slate-500">
                  Leave empty to allow unlimited attendees
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Update Event
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}