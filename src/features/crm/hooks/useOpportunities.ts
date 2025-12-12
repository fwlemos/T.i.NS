import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { OpportunityWithRelations, PipelineStage } from '../types';

export function useOpportunities() {
    const queryClient = useQueryClient();

    // Fetch Stages
    const { data: stages = [], isLoading: isLoadingStages } = useQuery({
        queryKey: ['pipeline-stages'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('pipeline_stages')
                .select('*')
                .eq('is_active', true)
                .order('position');
            if (error) throw error;
            return data as PipelineStage[];
        },
    });

    // Fetch Opportunities
    const { data: opportunities = [], isLoading: isLoadingOpportunities } = useQuery({
        queryKey: ['opportunities'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('opportunities')
                .select(`
                    *,
                    contact:contacts(*, company:companies(*)),
                    company:companies(*),
                    stage:pipeline_stages(*)
                `);

            // Note: Standard Supabase cannot join auth.users directly. 
            // We usually need a trigger or a public profile table.
            // For now, we will omit owner_profile joining if it fails or assume a 'profiles' table exists.
            // PRD mentions `users` table.
            // If `owner_id` is UUID, we might filter it client side or assume we have profiles.

            if (error) throw error;
            return data as OpportunityWithRelations[];
        },
    });

    // Mutation: Create Opportunity
    const createOpportunity = useMutation({
        mutationFn: async (newOpp: {
            title: string;
            contact_id: string;
            stage_id: string;
            lead_origin_id: string;
            notes?: string;
            product_ids: string[];
        }) => {
            const { product_ids, ...oppData } = newOpp;

            // 1. Get current user
            const { data: { user } } = await supabase.auth.getUser();

            // 2. Create Opportunity
            const { data: opp, error: oppError } = await supabase
                .from('opportunities')
                .insert([{ ...oppData, office: 'TIA', owner_id: user?.id }])
                .select()
                .single();

            if (oppError) throw oppError;

            // 2. Add Products
            if (product_ids.length > 0) {
                const { error: prodError } = await supabase
                    .from('opportunity_products')
                    .insert(product_ids.map(pid => ({
                        opportunity_id: opp.id,
                        product_id: pid,
                        quantity: 1
                    })));
                if (prodError) throw prodError;
            }

            return opp;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        },
    });

    // Mutation: Update Stage
    const updateStage = useMutation({
        mutationFn: async ({ id, stage_id }: { id: string; stage_id: string }) => {
            const { error } = await supabase
                .from('opportunities')
                .update({
                    stage_id,
                    stage_changed_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
        },
        onMutate: async ({ id, stage_id }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['opportunities'] });

            // Snapshot the previous value
            const previousOpportunities = queryClient.getQueryData<OpportunityWithRelations[]>(['opportunities']);

            // Optimistically update to the new value
            queryClient.setQueryData<OpportunityWithRelations[]>(['opportunities'], (old) => {
                if (!old) return [];
                return old.map((opp) => {
                    if (opp.id === id) {
                        return {
                            ...opp,
                            stage_id,
                            // Optimistically update timestamp too
                            // Assuming we'll extend the type below, or ignore type error for now if strictly typed
                            stage_changed_at: new Date().toISOString()
                        } as any;
                    }
                    return opp;
                });
            });

            // Return a context object with the snapshotted value
            return { previousOpportunities };
        },
        onError: (_err, _newTodo, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousOpportunities) {
                queryClient.setQueryData(['opportunities'], context.previousOpportunities);
            }
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        },
    });

    // Query: Get Single Opportunity
    const useOpportunity = (id: string) => useQuery({
        queryKey: ['opportunity', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('opportunities')
                .select(`
                    *,
                    contact:contacts(*, company:companies(*)),
                    company:companies(*),
                    stage:pipeline_stages(*),
                    owner_profile:profiles!owner_id(*),
                    products:opportunity_products(
                        *,
                        product:products(*, manufacturer:companies(*))
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as OpportunityWithRelations;
        },
        enabled: !!id,
    });

    // Mutation: Update Opportunity
    const updateOpportunity = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<OpportunityWithRelations> }) => {
            // Remove nested objects before update
            const {
                contact, company, stage, owner_profile, products,
                // computed fields
                days_in_stage, total_net_value, total_sales_value, currency,
                ...updateData
            } = data as any;

            const { error } = await supabase
                .from('opportunities')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
            queryClient.invalidateQueries({ queryKey: ['opportunity', variables.id] });
        },
    });

    return {
        stages,
        opportunities,
        isLoading: isLoadingStages || isLoadingOpportunities,
        createOpportunity,
        updateStage,
        useOpportunity,
        updateOpportunity
    };
}
