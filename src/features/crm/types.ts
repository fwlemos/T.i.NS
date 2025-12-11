import { Database } from '@/lib/supabase/types';

export type Opportunity = Database['public']['Tables']['opportunities']['Row'];
export type Contact = Database['public']['Tables']['contacts']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];
export type PipelineStage = Database['public']['Tables']['pipeline_stages']['Row'];

export interface OpportunityWithRelations extends Opportunity {
    contact: Contact | null;
    company: Company | null;
    stage: PipelineStage | null;
    owner_profile: {
        full_name: string;
        avatar_url: string | null;
    } | null;
    products?: {
        id: string;
        product: { name: string; manufacturer_id: string } | null;
        quantity: number;
    }[];
    // We might calculate these or fetch them
    days_in_stage?: number;
    total_net_value?: number;
    total_sales_value?: number;
    currency?: string;
}

export type CRMViewType = 'kanban' | 'list';
