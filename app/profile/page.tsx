import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '../components/Navbar';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUserProfile, updateProfileAction } from '../lib/actions/user.actions';
import { revalidatePath } from 'next/cache';
import { User, Mail, FileText } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect('/login');
  }

  const userProfile = await getUserProfile(session.user.email);

  async function handleUpdateProfile(formData: FormData) {
    'use server';
    const result = await updateProfileAction(formData);
    if (result.success) {
      revalidatePath('/profile');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <User className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto shadow-xl border-slate-200 bg-white">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800">
              Profile Information
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Update your profile information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleUpdateProfile} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  disabled
                  className="h-11 bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                />
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <span className="inline-block w-1 h-1 bg-slate-400 rounded-full"></span>
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="username" className="text-slate-700 font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={userProfile.username}
                  required
                  className="h-11 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="bio" className="text-slate-700 font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  Bio <span className="text-slate-500 font-normal text-sm">(Optional)</span>
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  defaultValue={userProfile.bio || ''}
                  rows={4}
                  className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors resize-none"
                />
                <p className="text-sm text-slate-500">
                  Share a bit about yourself with the community
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}