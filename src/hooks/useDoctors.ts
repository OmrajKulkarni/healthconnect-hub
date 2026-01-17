/**
 * Hook to fetch doctors from the database
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Doctor } from '@/types';

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('doctors_public')
        .select('*');

      if (error) throw error;

      const mappedDoctors: Doctor[] = (data || []).map((doc) => ({
        id: doc.id || '',
        name: doc.name || '',
        specialization: doc.specialization || '',
        rating: doc.rating || 4.0,
        location: doc.location || '',
        availableTimings: doc.available_timings || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
      }));

      setDoctors(mappedDoctors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return { doctors, loading, error, refetch: fetchDoctors };
}

/**
 * Hook to get a single doctor by ID
 */
export function useDoctor(id: string) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('doctors_public')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setDoctor({
            id: data.id || '',
            name: data.name || '',
            specialization: data.specialization || '',
            rating: data.rating || 4.0,
            location: data.location || '',
            availableTimings: data.available_timings || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch doctor');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);

  return { doctor, loading, error };
}

/**
 * Search doctors by symptoms and location
 */
export function useSearchDoctors() {
  const [results, setResults] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDoctors = async (symptoms: string, location: string) => {
    setLoading(true);
    try {
      let query = supabase.from('doctors_public').select('*');

      // Search by specialization (symptoms map to specializations)
      if (symptoms) {
        query = query.ilike('specialization', `%${symptoms}%`);
      }

      // Filter by location
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const mappedResults: Doctor[] = (data || []).map((doc) => ({
        id: doc.id || '',
        name: doc.name || '',
        specialization: doc.specialization || '',
        rating: doc.rating || 4.0,
        location: doc.location || '',
        availableTimings: doc.available_timings || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
      }));

      setResults(mappedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search doctors');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchDoctors };
}
