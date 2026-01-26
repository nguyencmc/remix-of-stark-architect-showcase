import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AssignmentType } from '../types';

// Fetch reference data for assignment selection
export const useRefData = (type: AssignmentType) => {
  return useQuery({
    queryKey: ['ref-data', type],
    queryFn: async () => {
      switch (type) {
        case 'exam':
        case 'practice':
          const { data: sets, error: setsError } = await supabase
            .from('question_sets')
            .select('id, title, question_count, level')
            .eq('is_published', true)
            .order('title');
          if (setsError) throw setsError;
          return sets;
        
        case 'book':
          const { data: books, error: booksError } = await supabase
            .from('books')
            .select('id, title, author_name, page_count')
            .order('title');
          if (booksError) throw booksError;
          return books;
        
        case 'podcast':
          const { data: podcasts, error: podcastsError } = await supabase
            .from('podcasts')
            .select('id, title, host_name, duration_seconds')
            .order('title');
          if (podcastsError) throw podcastsError;
          return podcasts;
        
        default:
          return [];
      }
    },
  });
};
