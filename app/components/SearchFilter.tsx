'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';

const categories = [
  'all',
  'Technology',
  'Business',
  'Arts',
  'Sports',
  'Music',
  'Education',
  'Other',
];

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/?${params.toString()}`);
  };

  const currentCategory = searchParams.get('category') || 'all';

  return (
    <div className="space-y-6 bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors text-base"
          />
        </div>
        <Button 
          type="submit"
          className="h-12 px-8 cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 sm:w-auto w-full"
        >
          Search
        </Button>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={currentCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className={
                currentCategory === category
                  ? 'cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md border-0 transition-all duration-300'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-medium transition-all duration-300 cursor-pointer'
              }
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}