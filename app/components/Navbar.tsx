// NavbarClient.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { CalendarDays, User, PlusCircle, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import SignoutButton from './SignoutButton';

export default function NavbarClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const NavLink = ({ 
    href, 
    children, 
    icon: Icon, 
    variant = 'ghost',
    highlight = false 
  }: { 
    href: string; 
    children: React.ReactNode; 
    icon?: any;
    variant?: 'ghost' | 'default';
    highlight?: boolean;
  }) => {
    const active = isActive(href);
    
    return (
      <Link href={href} className="w-full md:w-auto">
        <Button
          variant={variant}
          className={`
            w-full md:w-auto justify-start md:justify-center font-medium transition-all duration-200
            ${active && !highlight
              ? 'bg-slate-200 text-slate-900 hover:bg-slate-300' 
              : highlight
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
              : 'hover:bg-slate-100'
            }
            ${Icon ? 'flex items-center gap-2' : ''}
          `}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {children}
          {active && !highlight && (
            <span className="hidden md:inline-block ml-2 h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white shadow-md backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            <div className="p-1.5 md:p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <CalendarDays className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <span className="hidden sm:inline">EventOrganizer</span>
            <span className="sm:hidden">Events</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/">Events</NavLink>

            {session?.user ? (
              <>
                <NavLink href="/my-events">My Events</NavLink>
                <NavLink href="/create" icon={PlusCircle} highlight>
                  Create Event
                </NavLink>
                <NavLink href="/profile" icon={User}>Profile</NavLink>
                <SignoutButton />
              </>
            ) : (
              <>
                <NavLink href="/login">Sign In</NavLink>
                <NavLink href="/register" variant="default" highlight>
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle menu"
          >
            {!mobileMenuOpen && (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Overlay */}
     {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 h-screen"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Slide-in Menu */}
          <div className="md:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 overflow-hidden animate-in slide-in-from-right duration-300 h-screen">
          
            {/* Close Button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
      
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Toggle menu"
          >
            
             {
              mobileMenuOpen && (
              <X className="h-6 w-6" />
              )
             } 
              </Button>
            </div>
      
          
            <div className="px-4 py-6 flex flex-col gap-2 mt-[57px]">
              <NavLink href="/">Events</NavLink>

              {session?.user ? (
                <>
                  <NavLink href="/my-events">My Events</NavLink>
                  <NavLink href="/create" icon={PlusCircle} highlight>
                    Create Event
                  </NavLink>
                  <NavLink href="/profile" icon={User}>Profile</NavLink>
                  <div className="pt-4 mt-2 border-t border-slate-200">
                    <SignoutButton />
                  </div>
                </>
              ) : (
                <>
                  <NavLink href="/login">Sign In</NavLink>
                  <NavLink href="/register" variant="default" highlight>
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </>
      )}
      </div>
    </nav>
  );
}