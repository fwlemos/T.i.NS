import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchResultItem {
    id: string;
    entity_type: 'company' | 'manufacturer' | 'contact' | 'product';
    primary_text: string;
    secondary_text: string;
}

export function useGlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Debounce query to avoid slamming the database
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);

            try {
                const { data, error } = await supabase.rpc('search_global', {
                    p_query: debouncedQuery
                });

                if (error) {
                    console.error('Search error:', error);
                    setResults([]);
                } else {
                    setResults(data as SearchResultItem[]);
                }
            } catch (err) {
                console.error('Search exception:', err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    return {
        query,
        setQuery,
        results,
        setResults,
        isLoading,
        isOpen,
        setIsOpen
    };
}
