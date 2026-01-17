/**
 * Search Page
 * Allows patients to search for doctors by symptoms and location
 */

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SearchForm } from '@/components/search/SearchForm';
import { DoctorList } from '@/components/doctors/DoctorList';
import { useDoctors, useSearchDoctors } from '@/hooks/useDoctors';
import { SearchFilters } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Users } from 'lucide-react';

export default function SearchPage() {
  // Fetch all doctors from database
  const { doctors: allDoctors, loading: loadingAll } = useDoctors();
  const { results, loading: searching, searchDoctors } = useSearchDoctors();
  
  // State for search
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSearch, setCurrentSearch] = useState<SearchFilters | null>(null);

  // Handle search
  const handleSearch = async (filters: SearchFilters) => {
    setCurrentSearch(filters);
    setHasSearched(true);
    await searchDoctors(
      filters.symptoms, 
      filters.location === 'all' ? '' : filters.location
    );
  };

  const isLoading = searching || loadingAll;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <Stethoscope className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Doctor Search</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find the Right Doctor for You
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your symptoms or illness to find doctors who specialize in treating your condition.
            Filter by location to find convenient options near you.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <SearchForm onSearch={handleSearch} isLoading={searching} />
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {/* Results Header */}
          {hasSearched && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">
                  {results.length} doctor{results.length !== 1 ? 's' : ''} found
                </span>
                {currentSearch?.symptoms && (
                  <Badge variant="secondary">
                    {currentSearch.symptoms}
                  </Badge>
                )}
                {currentSearch?.location && currentSearch.location !== 'all' && (
                  <Badge variant="outline">
                    {currentSearch.location}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Doctor List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {hasSearched ? (
                <DoctorList doctors={results} isSearching={hasSearched} />
              ) : (
                /* Show all doctors if no search performed */
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      All Available Doctors ({allDoctors.length})
                    </span>
                  </div>
                  <DoctorList doctors={allDoctors.slice(0, 9)} />
                  {allDoctors.length > 9 && (
                    <p className="text-center text-muted-foreground mt-6">
                      Search above to see more doctors matching your needs
                    </p>
                  )}
                  {allDoctors.length === 0 && !loadingAll && (
                    <p className="text-center text-muted-foreground mt-6">
                      No doctors registered yet. Register as a doctor to appear here!
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
