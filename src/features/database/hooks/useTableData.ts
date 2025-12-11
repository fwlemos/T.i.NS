import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { PaginationState, SortingState } from '@tanstack/react-table';

interface UseTableDataProps {
    tableName: string;
    select?: string;
    filters?: Record<string, any>;
    searchQuery?: string;
    searchColumns?: string[];
}

export function useTableData<T>({
    tableName,
    select = '*',
    filters = {},
    searchQuery = '',
    searchColumns = ['name']
}: UseTableDataProps) {
    const [data, setData] = useState<T[]>([]);
    const [count, setCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Table state
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from(tableName)
                .select(select, { count: 'exact' });

            // Apply filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    query = query.eq(key, value);
                }
            });

            // Apply search
            if (searchQuery && searchColumns.length > 0) {
                const orFilter = searchColumns
                    .map(col => `${col}.ilike.%${searchQuery}%`)
                    .join(',');
                query = query.or(orFilter);
            }

            // Apply sorting
            if (sorting.length > 0) {
                const { id, desc } = sorting[0];
                query = query.order(id, { ascending: !desc });
            } else {
                // Default sort by created_at desc if available, else id
                // Assuming most tables have created_at
                query = query.order('created_at', { ascending: false });
            }

            // Apply pagination
            const from = pagination.pageIndex * pagination.pageSize;
            const to = from + pagination.pageSize - 1;
            query = query.range(from, to);

            const { data, count, error } = await query;

            if (error) {
                console.error(`Error fetching ${tableName}:`, error);
                // Toast error here?
            } else {
                setData(data as T[]);
                setCount(count || 0);
            }
        } catch (err) {
            console.error('Exception fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tableName, select, JSON.stringify(filters), searchQuery, JSON.stringify(searchColumns), pagination, sorting]);

    return {
        data,
        count,
        pageCount: Math.ceil(count / pagination.pageSize),
        isLoading,
        pagination,
        setPagination,
        sorting,
        setSorting,
        fetchData,
    };
}
