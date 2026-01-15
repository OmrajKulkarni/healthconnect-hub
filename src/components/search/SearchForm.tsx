/**
 * SearchForm Component
 * Form for searching doctors by symptoms and location
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Stethoscope } from 'lucide-react';
import { LOCATIONS } from '@/data/doctors';
import { SearchFilters } from '@/types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ symptoms, location });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Symptoms Input */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Label htmlFor="symptoms" className="sr-only">
            Symptoms or Illness
          </Label>
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="symptoms"
              placeholder="Enter symptoms (e.g., headache, chest pain)"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Location Dropdown */}
        <div>
          <Label htmlFor="location" className="sr-only">
            Location
          </Label>
          <div className="relative">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-12">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <div>
          <Button 
            type="submit" 
            className="w-full h-12"
            variant="gradient"
            disabled={isLoading}
          >
            <Search className="h-4 w-4 mr-2" />
            Search Doctors
          </Button>
        </div>
      </div>

      {/* Quick search suggestions */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-muted-foreground">Popular:</span>
        {['headache', 'chest pain', 'diabetes', 'skin', 'anxiety'].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => {
              setSymptoms(term);
              onSearch({ symptoms: term, location });
            }}
            className="text-primary hover:underline capitalize"
          >
            {term}
          </button>
        ))}
      </div>
    </form>
  );
}
