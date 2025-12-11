import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useCRMOptions() {
    const { data: leadOrigins = [] } = useQuery({
        queryKey: ['lead-origins'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('lead_origins')
                .select('*')
                .order('name');
            if (error) throw error;
            return data;
        },
    });

    const { data: contacts = [] } = useQuery({
        queryKey: ['lite-contacts'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('contacts')
                .select('id, name')
                .order('name')
                .limit(100); // Limit for performance in dropdown
            if (error) throw error;
            return data;
        },
    });

    const { data: products = [] } = useQuery({
        queryKey: ['lite-products'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('id, name')
                .order('name')
                .limit(100);
            if (error) throw error;
            return data;
        },
    });

    const { data: incoterms = [] } = useQuery({
        queryKey: ['incoterms'],
        queryFn: async () => {
            const { data, error } = await supabase.from('incoterms').select('*').eq('is_active', true);
            if (error) throw error;
            return data;
        }
    });

    const { data: saleTypes = [] } = useQuery({
        queryKey: ['sale-types'],
        queryFn: async () => {
            const { data, error } = await supabase.from('sale_types').select('*').eq('is_active', true);
            if (error) throw error;
            return data;
        }
    });

    const { data: paymentTerms = [] } = useQuery({
        queryKey: ['payment-terms'],
        queryFn: async () => {
            const { data, error } = await supabase.from('payment_terms').select('*').eq('is_active', true);
            if (error) throw error;
            return data;
        }
    });

    return {
        leadOrigins,
        contacts,
        products,
        incoterms,
        saleTypes,
        paymentTerms
    };
}
