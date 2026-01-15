/**
 * DoctorList Component
 * Displays a grid of doctor cards
 */

import { Doctor } from '@/types';
import { DoctorCard } from './DoctorCard';
import { SearchX } from 'lucide-react';

interface DoctorListProps {
  doctors: Doctor[];
  isSearching?: boolean;
}

export function DoctorList({ doctors, isSearching = false }: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <SearchX className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isSearching ? 'No doctors found' : 'Search for doctors'}
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {isSearching 
            ? 'Try adjusting your search terms or selecting a different location.'
            : 'Enter your symptoms or illness to find the right doctor for you.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor, index) => (
        <div 
          key={doctor.id} 
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <DoctorCard doctor={doctor} />
        </div>
      ))}
    </div>
  );
}
