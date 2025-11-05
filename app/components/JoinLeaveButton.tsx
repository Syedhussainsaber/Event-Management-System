'use client';

import { Button } from '@/components/ui/button';
import { joinEventAction, leaveEventAction } from '../lib/actions/event.actions';
import { useState, useTransition } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';

interface JoinLeaveButtonProps {
  eventId: string;
  isAttending: boolean;
  isFull: boolean;
}

export default function JoinLeaveButton({ eventId, isAttending, isFull }: JoinLeaveButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const handleJoin = () => {
    setError('');
    startTransition(async () => {
      const result = await joinEventAction(eventId);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  const handleLeave = () => {
    setError('');
    startTransition(async () => {
      const result = await leaveEventAction(eventId);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-2">
      {isAttending ? (
        <Button
          onClick={handleLeave}
          disabled={isPending}
          variant="outline"
          className="w-full cursor-pointer"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          {isPending ? 'Leaving...' : 'Leave Event'}
        </Button>
      ) : (
        <Button
          onClick={handleJoin}
          disabled={isPending || isFull}
          className="w-full cursor-pointer"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {isPending ? 'Joining...' : isFull ? 'Event Full' : 'Join Event'}
        </Button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}