-- CRM Module Schema Migration

-- 1. Lookup Tables

-- Lead Origins
CREATE TABLE IF NOT EXISTS public.lead_origins (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sale Types
CREATE TABLE IF NOT EXISTS public.sale_types (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Lost Reasons
CREATE TABLE IF NOT EXISTS public.lost_reasons (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Incoterms
CREATE TABLE IF NOT EXISTS public.incoterms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL, -- e.g., EXW, FOB, CIF, DDP
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payment Terms
CREATE TABLE IF NOT EXISTS public.payment_terms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL, -- e.g., Net 30, 50% Advance/50% Delivery
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Pipeline Configuration

-- Pipeline Stages
CREATE TABLE IF NOT EXISTS public.pipeline_stages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    position integer NOT NULL,
    color text NOT NULL DEFAULT '#E5E7EB',
    is_system boolean DEFAULT false, -- If true, cannot be deleted (e.g. Lead, Won, Lost)
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Stage Field Requirements
CREATE TABLE IF NOT EXISTS public.stage_field_requirements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    stage_id uuid REFERENCES public.pipeline_stages(id) ON DELETE CASCADE NOT NULL,
    field_name text NOT NULL,
    is_required boolean DEFAULT false,
    is_custom_field boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(stage_id, field_name)
);

-- 3. Opportunities

CREATE TYPE public.office_location AS ENUM ('TIA', 'TIC');

CREATE TABLE IF NOT EXISTS public.opportunities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL, -- Keeping opportunity even if contact deleted? Or CASCADE? Set NULL safer for history.
    company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
    stage_id uuid REFERENCES public.pipeline_stages(id) ON DELETE RESTRICT, -- Prevent deleting stage if used
    owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    office public.office_location NOT NULL,
    lead_origin_id uuid REFERENCES public.lead_origins(id) ON DELETE SET NULL,
    type_of_sale_id uuid REFERENCES public.sale_types(id) ON DELETE SET NULL,
    
    usage_description text,
    
    estimated_close_date date,
    client_payment_terms_id uuid REFERENCES public.payment_terms(id) ON DELETE SET NULL,
    estimated_delivery_weeks integer,
    incoterm_id uuid REFERENCES public.incoterms(id) ON DELETE SET NULL,
    
    needs_peripherals boolean DEFAULT false,
    
    -- Documents handled by generic documents table, but we might want a direct reference for the PO
    purchase_order_file_id text, -- Assuming generic file path or ID stored as text if not using specific table
    purchase_order_justification text,
    
    manufacturer_payment_terms_id uuid REFERENCES public.payment_terms(id) ON DELETE SET NULL,
    client_delivery_deadline date,
    manufacturer_delivery_deadline date,
    
    lost_reason_id uuid REFERENCES public.lost_reasons(id) ON DELETE SET NULL,
    lost_at timestamp with time zone,
    won_at timestamp with time zone,
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    updated_by uuid REFERENCES auth.users(id)
);

-- Opportunity Products (Pre-Quote)
CREATE TABLE IF NOT EXISTS public.opportunity_products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id uuid REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity integer DEFAULT 1 CHECK (quantity > 0),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Peripherals
CREATE TABLE IF NOT EXISTS public.peripherals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id uuid REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Quotations

CREATE TYPE public.quotation_type AS ENUM ('Direct Importation', 'Nationalized Sale');
CREATE TYPE public.quotation_status AS ENUM ('Draft', 'Sent', 'Accepted', 'Rejected');

CREATE TABLE IF NOT EXISTS public.quotations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id uuid REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    type public.quotation_type NOT NULL,
    version_number integer NOT NULL DEFAULT 1,
    status public.quotation_status NOT NULL DEFAULT 'Draft',
    
    quote_number text NOT NULL, -- System generated, e.g., QT-2025-0001
    currency text NOT NULL DEFAULT 'USD', -- Default currency for totals
    valid_until date,
    
    sent_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    UNIQUE(opportunity_id, type, version_number)
);

-- Quotation Items
CREATE TABLE IF NOT EXISTS public.quotation_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    quotation_id uuid REFERENCES public.quotations(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL, -- Shouldn't delete product if part of a quote
    
    quantity integer DEFAULT 1 CHECK (quantity > 0),
    
    net_price numeric(20, 2) NOT NULL DEFAULT 0,
    net_currency text NOT NULL DEFAULT 'USD',
    
    sales_price numeric(20, 2) NOT NULL DEFAULT 0,
    sales_currency text NOT NULL DEFAULT 'USD',
    
    discount_percent numeric(5, 2) DEFAULT 0, -- 0 to 100
    discount_amount numeric(20, 2) DEFAULT 0,
    
    warranty_years numeric(4, 1),
    estimated_delivery_weeks integer,
    
    includes_installation boolean DEFAULT false,
    includes_training boolean DEFAULT false,
    
    notes text,
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable RLS

ALTER TABLE public.lead_origins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incoterms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_field_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peripherals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Allow Authenticated View/Edit for simplicity for now, can be restricted later)

CREATE POLICY "Enable read access for authenticated users" ON public.lead_origins FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON public.sale_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON public.lost_reasons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON public.incoterms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON public.payment_terms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON public.pipeline_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access for authenticated users" ON public.stage_field_requirements FOR SELECT TO authenticated USING (true);

-- Opportunities: Full access for authenticated users (Ownership logic handled in app or specific policy later)
CREATE POLICY "Enable full access for authenticated users" ON public.opportunities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable full access for authenticated users" ON public.opportunity_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable full access for authenticated users" ON public.peripherals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable full access for authenticated users" ON public.quotations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable full access for authenticated users" ON public.quotation_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Seed Data

INSERT INTO public.lead_origins (name) VALUES 
('Website'), ('Referral'), ('Trade Show'), ('Cold Call'), ('Manufacturer'), ('Partner'), ('Other');

INSERT INTO public.sale_types (name) VALUES 
('Direct Importation'), ('Nationalized Sale'), ('Commissioned Sale');

INSERT INTO public.lost_reasons (name) VALUES 
('Price'), ('Competition'), ('No Budget'), ('Timeline'), ('Scope Change'), ('No Response'), ('Other');

INSERT INTO public.incoterms (name, description) VALUES
('EXW', 'Ex Works'), ('FOB', 'Free on Board'), ('CIF', 'Cost, Insurance and Freight'), ('DDP', 'Delivered Duty Paid'), ('DAP', 'Delivered at Place');

INSERT INTO public.payment_terms (name) VALUES 
('Net 30'), ('Net 60'), ('100% Advance'), ('50% Advance / 50% Delivery'), ('Upon Delivery');

INSERT INTO public.pipeline_stages (name, position, color, is_system) VALUES
('Lead Backlog', 1, '#9CA3AF', true),
('Qualification', 2, '#60A5FA', false),
('Quotation', 3, '#FBBF24', false),
('Closing', 4, '#F472B6', false),
('Won', 5, '#34D399', true),
('Lost', 6, '#EF4444', true);
