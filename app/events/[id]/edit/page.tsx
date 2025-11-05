import { getEventById, updateEventAction } from '@/app/lib/actions/event.actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/app/components/Navbar';
import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Event</CardTitle>
            <CardDescription>
              Update the details of your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleUpdateEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={event.title}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={event.description}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date & Time</Label>
                  <Input
                    id="date"
                    name="date"
                    type="datetime-local"
                    defaultValue={eventDate}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={event.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={event.location}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Max Attendees (Optional)</Label>
                <Input
                  id="maxAttendees"
                  name="maxAttendees"
                  type="number"
                  min="1"
                  defaultValue={event.maxAttendees || ''}
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Update Event
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}