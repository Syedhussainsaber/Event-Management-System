import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { CalendarDays, User, LogOut, PlusCircle } from 'lucide-react';
import SignoutButton from './SignoutButton';

export default async function Navbar() {
  const session = await getServerSession();

  return (
    <nav className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white shadow-md backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <CalendarDays className="h-6 w-6 text-white" />
          </div>
          EventOrganizer
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button 
              className="cursor-pointer font-medium hover:bg-slate-100 transition-colors" 
              variant="ghost"
            >
              Events
            </Button>
          </Link>

          {session?.user ? (
            <>
              <Link href="/my-events">
                <Button 
                  variant="ghost" 
                  className="cursor-pointer font-medium hover:bg-slate-100 transition-colors"
                >
                  My Events
                </Button>
              </Link>
              <Link href="/create">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 cursor-pointer font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Event
                </Button>
              </Link>
              <Link href="/profile">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 cursor-pointer font-medium hover:bg-slate-100 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <SignoutButton/>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button 
                  className="cursor-pointer font-medium hover:bg-slate-100 transition-colors" 
                  variant="ghost"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  className="cursor-pointer font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}