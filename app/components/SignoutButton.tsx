"use client";


import React, { useState } from 'react'
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SignoutButton = () => {

      const router = useRouter();

      const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
        try {
          await signOut({ callbackUrl: "/login" });

          alert("You have been signed out.");
          router.push("/login");
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
        }
      }

  return (
        <form onSubmit={handleLogout}>
                <Button type="submit" variant="outline" className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </form>
  )

}

export default SignoutButton