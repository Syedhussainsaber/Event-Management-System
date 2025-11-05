'use client';

import { Button } from '@/components/ui/button';
import { deleteEventAction } from '../lib/actions/event.actions';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface EventActionsProps {
  eventId: string;
}

export default function EventActions({ eventId }: EventActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteEventAction(eventId);
      if (result.success) {
        router.push('/my-events');
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Link href={`/events/${eventId}/edit`}>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      {!showConfirm ? (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowConfirm(true)}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Confirm'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}