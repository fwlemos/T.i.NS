export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            audit_logs: {
                Row: {
                    action: string
                    changes: Json
                    created_at: string
                    entity_id: string
                    entity_type: string
                    id: string
                    user_id: string | null
                }
                Insert: {
                    action: string
                    changes?: Json
                    created_at?: string
                    entity_id: string
                    entity_type: string
                    id?: string
                    user_id?: string | null
                }
                Update: {
                    action?: string
                    changes?: Json
                    created_at?: string
                    entity_id?: string
                    entity_type?: string
                    id?: string
                    user_id?: string | null
                }
                Relationships: []
            }
            auth_audit_log: {
                Row: {
                    created_at: string
                    details: Json
                    event_type: string
                    id: string
                    ip_address: unknown
                    target_user_id: string | null
                    user_agent: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    details?: Json
                    event_type: string
                    id?: string
                    ip_address?: unknown
                    target_user_id?: string | null
                    user_agent?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    details?: Json
                    event_type?: string
                    id?: string
                    ip_address?: unknown
                    target_user_id?: string | null
                    user_agent?: string | null
                    user_id?: string | null
                }
                Relationships: []
            }
            companies: {
                Row: {
                    address: Json | null
                    contract_file_id: string | null
                    contract_validity: string | null
                    created_at: string
                    created_by: string | null
                    exclusivity_file_id: string | null
                    has_exclusivity: boolean | null
                    id: string
                    name: string
                    notes: string | null
                    phone: string | null
                    tax_id: string | null
                    type: Database["public"]["Enums"]["company_type"]
                    updated_at: string
                    updated_by: string | null
                    website: string | null
                }
                Insert: {
                    address?: Json | null
                    contract_file_id?: string | null
                    contract_validity?: string | null
                    created_at?: string
                    created_by?: string | null
                    exclusivity_file_id?: string | null
                    has_exclusivity?: boolean | null
                    id?: string
                    name: string
                    notes?: string | null
                    phone?: string | null
                    tax_id?: string | null
                    type: Database["public"]["Enums"]["company_type"]
                    updated_at?: string
                    updated_by?: string | null
                    website?: string | null
                }
                Update: {
                    address?: Json | null
                    contract_file_id?: string | null
                    contract_validity?: string | null
                    created_at?: string
                    created_by?: string | null
                    exclusivity_file_id?: string | null
                    has_exclusivity?: boolean | null
                    id?: string
                    name?: string
                    notes?: string | null
                    phone?: string | null
                    tax_id?: string | null
                    type?: Database["public"]["Enums"]["company_type"]
                    updated_at?: string
                    updated_by?: string | null
                    website?: string | null
                }
                Relationships: []
            }
            contacts: {
                Row: {
                    city: string | null
                    company_id: string | null
                    complement: string | null
                    country: string | null
                    created_at: string
                    created_by: string | null
                    email: string | null
                    formatted_address: string | null
                    id: string
                    is_individual: boolean | null
                    job_title: string | null
                    name: string
                    neighborhood: string | null
                    notes: string | null
                    phone: string | null
                    place_id: string | null
                    postal_code: string | null
                    state_province: string | null
                    street: string | null
                    updated_at: string
                    updated_by: string | null
                }
                Insert: {
                    city?: string | null
                    company_id?: string | null
                    complement?: string | null
                    country?: string | null
                    created_at?: string
                    created_by?: string | null
                    email?: string | null
                    formatted_address?: string | null
                    id?: string
                    is_individual?: boolean | null
                    job_title?: string | null
                    name: string
                    neighborhood?: string | null
                    notes?: string | null
                    phone?: string | null
                    place_id?: string | null
                    postal_code?: string | null
                    state_province?: string | null
                    street?: string | null
                    updated_at?: string
                    updated_by?: string | null
                }
                Update: {
                    city?: string | null
                    company_id?: string | null
                    complement?: string | null
                    country?: string | null
                    created_at?: string
                    created_by?: string | null
                    email?: string | null
                    formatted_address?: string | null
                    id?: string
                    is_individual?: boolean | null
                    job_title?: string | null
                    name?: string
                    neighborhood?: string | null
                    notes?: string | null
                    phone?: string | null
                    place_id?: string | null
                    postal_code?: string | null
                    state_province?: string | null
                    street?: string | null
                    updated_at?: string
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "contacts_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                ]
            }
            incoterms: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    is_active: boolean | null
                    name: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                }
                Relationships: []
            }
            lead_origins: {
                Row: {
                    created_at: string
                    id: string
                    is_active: boolean | null
                    name: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    is_active?: boolean | null
                    name: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_active?: boolean | null
                    name?: string
                }
                Relationships: []
            }
            lost_reasons: {
                Row: {
                    created_at: string
                    id: string
                    is_active: boolean | null
                    name: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    is_active?: boolean | null
                    name: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_active?: boolean | null
                    name?: string
                }
                Relationships: []
            }
            manufacturer_banking_accounts: {
                Row: {
                    account_number: string
                    bank_name: string
                    created_at: string
                    created_by: string | null
                    currency: string
                    iban: string | null
                    id: string
                    intermediary_bank: string | null
                    is_primary: boolean | null
                    manufacturer_id: string | null
                    notes: string | null
                    routing_number: string | null
                    swift_code: string | null
                    updated_at: string
                    updated_by: string | null
                }
                Insert: {
                    account_number: string
                    bank_name: string
                    created_at?: string
                    created_by?: string | null
                    currency: string
                    iban?: string | null
                    id?: string
                    intermediary_bank?: string | null
                    is_primary?: boolean | null
                    manufacturer_id?: string | null
                    notes?: string | null
                    routing_number?: string | null
                    swift_code?: string | null
                    updated_at?: string
                    updated_by?: string | null
                }
                Update: {
                    account_number?: string
                    bank_name?: string
                    created_at?: string
                    created_by?: string | null
                    currency?: string
                    iban?: string | null
                    id?: string
                    intermediary_bank?: string | null
                    is_primary?: boolean | null
                    manufacturer_id?: string | null
                    notes?: string | null
                    routing_number?: string | null
                    swift_code?: string | null
                    updated_at?: string
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "manufacturer_banking_accounts_manufacturer_id_fkey"
                        columns: ["manufacturer_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                ]
            }
            opportunities: {
                Row: {
                    client_delivery_deadline: string | null
                    client_payment_terms_id: string | null
                    company_id: string | null
                    contact_id: string | null
                    created_at: string
                    created_by: string | null
                    estimated_close_date: string | null
                    estimated_delivery_weeks: number | null
                    id: string
                    incoterm_id: string | null
                    lead_origin_id: string | null
                    lost_at: string | null
                    lost_reason_id: string | null
                    manufacturer_delivery_deadline: string | null
                    manufacturer_payment_terms_id: string | null
                    needs_peripherals: boolean | null
                    office: Database["public"]["Enums"]["office_location"]
                    owner_id: string | null
                    purchase_order_file_id: string | null
                    purchase_order_justification: string | null
                    stage_id: string | null
                    title: string
                    type_of_sale_id: string | null
                    updated_at: string
                    updated_by: string | null
                    usage_description: string | null
                    won_at: string | null
                }
                Insert: {
                    client_delivery_deadline?: string | null
                    client_payment_terms_id?: string | null
                    company_id?: string | null
                    contact_id?: string | null
                    created_at?: string
                    created_by?: string | null
                    estimated_close_date?: string | null
                    estimated_delivery_weeks?: number | null
                    id?: string
                    incoterm_id?: string | null
                    lead_origin_id?: string | null
                    lost_at?: string | null
                    lost_reason_id?: string | null
                    manufacturer_delivery_deadline?: string | null
                    manufacturer_payment_terms_id?: string | null
                    needs_peripherals?: boolean | null
                    office: Database["public"]["Enums"]["office_location"]
                    owner_id?: string | null
                    purchase_order_file_id?: string | null
                    purchase_order_justification?: string | null
                    stage_id?: string | null
                    title: string
                    type_of_sale_id?: string | null
                    updated_at?: string
                    updated_by?: string | null
                    usage_description?: string | null
                    won_at?: string | null
                }
                Update: {
                    client_delivery_deadline?: string | null
                    client_payment_terms_id?: string | null
                    company_id?: string | null
                    contact_id?: string | null
                    created_at?: string
                    created_by?: string | null
                    estimated_close_date?: string | null
                    estimated_delivery_weeks?: number | null
                    id?: string
                    incoterm_id?: string | null
                    lead_origin_id?: string | null
                    lost_at?: string | null
                    lost_reason_id?: string | null
                    manufacturer_delivery_deadline?: string | null
                    manufacturer_payment_terms_id?: string | null
                    needs_peripherals?: boolean | null
                    office?: Database["public"]["Enums"]["office_location"]
                    owner_id?: string | null
                    purchase_order_file_id?: string | null
                    purchase_order_justification?: string | null
                    stage_id?: string | null
                    title?: string
                    type_of_sale_id?: string | null
                    updated_at?: string
                    updated_by?: string | null
                    usage_description?: string | null
                    won_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "opportunities_client_payment_terms_id_fkey"
                        columns: ["client_payment_terms_id"]
                        isOneToOne: false
                        referencedRelation: "payment_terms"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "opportunities_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "opportunities_contact_id_fkey"
                        columns: ["contact_id"]
                        isOneToOne: false
                        referencedRelation: "contacts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "opportunities_incoterm_id_fkey"
                        columns: ["incoterm_id"]
                        isOneToOne: false
                        referencedRelation: "incoterms"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "opportunities_lead_origin_id_fkey"
                        columns: ["lead_origin_id"]
                        isOneToOne: false
                        referencedRelation: "lead_origins"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "opportunities_lost_reason_id_fkey"
                        columns: ["lost_reason_id"]
                        isOneToOne: false
                        referencedRelation: "lost_reasons"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "opportunities_manufacturer_payment_terms_id_fkey"
                        columns: ["manufacturer_payment_terms_id"]
                        isOneToOne: false
                        referencedRelation: "payment_terms"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "opportunities_stage_id_fkey"
                        columns: ["stage_id"]
                        isOneToOne: false
                        referencedRelation: "pipeline_stages"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "opportunities_type_of_sale_id_fkey"
                        columns: ["type_of_sale_id"]
                        isOneToOne: false
                        referencedRelation: "sale_types"
                        referencedColumns: ["id"]
                    },
                ]
            }
            opportunity_products: {
                Row: {
                    created_at: string
                    id: string
                    opportunity_id: string
                    product_id: string
                    quantity: number | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    opportunity_id: string
                    product_id: string
                    quantity?: number | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    opportunity_id?: string
                    product_id?: string
                    quantity?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "opportunity_products_opportunity_id_fkey"
                        columns: ["opportunity_id"]
                        isOneToOne: false
                        referencedRelation: "opportunities"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "opportunity_products_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            payment_terms: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    is_active: boolean | null
                    name: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    is_active?: boolean | null
                    name: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    is_active?: boolean | null
                    name?: string
                }
                Relationships: []
            }
            peripherals: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    name: string
                    opportunity_id: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    name: string
                    opportunity_id: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    name?: string
                    opportunity_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "peripherals_opportunity_id_fkey"
                        columns: ["opportunity_id"]
                        isOneToOne: false
                        referencedRelation: "opportunities"
                        referencedColumns: ["id"]
                    },
                ]
            }
            permissions: {
                Row: {
                    action: string
                    code: string
                    created_at: string
                    description: string
                    entity: string | null
                    id: string
                    is_system: boolean
                    module: string
                }
                Insert: {
                    action: string
                    code: string
                    created_at?: string
                    description: string
                    entity?: string | null
                    id?: string
                    is_system?: boolean
                    module: string
                }
                Update: {
                    action?: string
                    code?: string
                    created_at?: string
                    description?: string
                    entity?: string | null
                    id?: string
                    is_system?: boolean
                    module: string
                }
                Relationships: []
            }
            pipeline_stages: {
                Row: {
                    color: string
                    created_at: string
                    id: string
                    is_active: boolean | null
                    is_system: boolean | null
                    name: string
                    position: number
                }
                Insert: {
                    color?: string
                    created_at?: string
                    id?: string
                    is_active?: boolean | null
                    is_system?: boolean | null
                    name: string
                    position: number
                }
                Update: {
                    color?: string
                    created_at?: string
                    id?: string
                    is_active?: boolean | null
                    is_system?: boolean | null
                    name?: string
                    position?: number
                }
                Relationships: []
            }
            products: {
                Row: {
                    created_at: string
                    created_by: string | null
                    default_warranty_years: number | null
                    description: string | null
                    id: string
                    manufacturer_id: string | null
                    name: string
                    notes: string | null
                    part_number: string | null
                    updated_at: string
                    updated_by: string | null
                }
                Insert: {
                    created_at?: string
                    created_by?: string | null
                    default_warranty_years?: number | null
                    description?: string | null
                    id?: string
                    manufacturer_id?: string | null
                    name: string
                    notes?: string | null
                    part_number?: string | null
                    updated_at?: string
                    updated_by?: string | null
                }
                Update: {
                    created_at?: string
                    created_by?: string | null
                    default_warranty_years?: number | null
                    description?: string | null
                    id?: string
                    manufacturer_id?: string | null
                    name?: string
                    notes?: string | null
                    part_number?: string | null
                    updated_at?: string
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "products_manufacturer_id_fkey"
                        columns: ["manufacturer_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    department: string | null
                    full_name: string
                    id: string
                    is_active: boolean
                    job_title: string | null
                    phone: string | null
                    role_id: string | null
                    updated_at: string
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    department?: string | null
                    full_name: string
                    id: string
                    is_active?: boolean
                    job_title?: string | null
                    phone?: string | null
                    role_id?: string | null
                    updated_at?: string
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    department?: string | null
                    full_name?: string
                    id?: string
                    is_active?: boolean
                    job_title?: string | null
                    phone?: string | null
                    role_id?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_role_id_fkey"
                        columns: ["role_id"]
                        isOneToOne: false
                        referencedRelation: "roles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            quotation_items: {
                Row: {
                    created_at: string
                    discount_amount: number | null
                    discount_percent: number | null
                    estimated_delivery_weeks: number | null
                    id: string
                    includes_installation: boolean | null
                    includes_training: boolean | null
                    net_currency: string
                    net_price: number
                    notes: string | null
                    product_id: string
                    quantity: number | null
                    quotation_id: string
                    sales_currency: string
                    sales_price: number
                    warranty_years: number | null
                }
                Insert: {
                    created_at?: string
                    discount_amount?: number | null
                    discount_percent?: number | null
                    estimated_delivery_weeks?: number | null
                    id?: string
                    includes_installation?: boolean | null
                    includes_training?: boolean | null
                    net_currency?: string
                    net_price?: number
                    notes?: string | null
                    product_id: string
                    quantity?: number | null
                    quotation_id: string
                    sales_currency?: string
                    sales_price?: number
                    warranty_years?: number | null
                }
                Update: {
                    created_at?: string
                    discount_amount?: number | null
                    discount_percent?: number | null
                    estimated_delivery_weeks?: number | null
                    id?: string
                    includes_installation?: boolean | null
                    includes_training?: boolean | null
                    net_currency?: string
                    net_price?: number
                    notes?: string | null
                    product_id?: string
                    quantity?: number | null
                    quotation_id?: string
                    sales_currency?: string
                    sales_price?: number
                    warranty_years?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "quotation_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "quotation_items_quotation_id_fkey"
                        columns: ["quotation_id"]
                        isOneToOne: false
                        referencedRelation: "quotations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            quotations: {
                Row: {
                    created_at: string
                    created_by: string | null
                    currency: string
                    id: string
                    opportunity_id: string
                    quote_number: string
                    sent_at: string | null
                    status: Database["public"]["Enums"]["quotation_status"]
                    type: Database["public"]["Enums"]["quotation_type"]
                    updated_at: string
                    valid_until: string | null
                    version_number: number
                }
                Insert: {
                    created_at?: string
                    created_by?: string | null
                    currency?: string
                    id?: string
                    opportunity_id: string
                    quote_number: string
                    sent_at?: string | null
                    status?: Database["public"]["Enums"]["quotation_status"]
                    type: Database["public"]["Enums"]["quotation_type"]
                    updated_at?: string
                    valid_until?: string | null
                    version_number?: number
                }
                Update: {
                    created_at?: string
                    created_by?: string | null
                    currency?: string
                    id?: string
                    opportunity_id?: string
                    quote_number?: string
                    sent_at?: string | null
                    status?: Database["public"]["Enums"]["quotation_status"]
                    type?: Database["public"]["Enums"]["quotation_type"]
                    updated_at?: string
                    valid_until?: string | null
                    version_number?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "quotations_opportunity_id_fkey"
                        columns: ["opportunity_id"]
                        isOneToOne: false
                        referencedRelation: "opportunities"
                        referencedColumns: ["id"]
                    },
                ]
            }
            role_permissions: {
                Row: {
                    created_at: string
                    granted: boolean
                    id: string
                    permission_id: string
                    role_id: string
                }
                Insert: {
                    created_at?: string
                    granted?: boolean
                    id?: string
                    permission_id: string
                    role_id: string
                }
                Update: {
                    created_at?: string
                    granted?: boolean
                    id?: string
                    permission_id?: string
                    role_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "role_permissions_permission_id_fkey"
                        columns: ["permission_id"]
                        isOneToOne: false
                        referencedRelation: "permissions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "role_permissions_role_id_fkey"
                        columns: ["role_id"]
                        isOneToOne: false
                        referencedRelation: "roles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            roles: {
                Row: {
                    created_at: string
                    created_by: string | null
                    description: string | null
                    hierarchy_level: number
                    id: string
                    is_system_role: boolean
                    name: string
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    created_by?: string | null
                    description?: string | null
                    hierarchy_level?: number
                    id?: string
                    is_system_role?: boolean
                    name: string
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    created_by?: string | null
                    description?: string | null
                    hierarchy_level?: number
                    id?: string
                    is_system_role?: boolean
                    name: string
                    updated_at?: string
                }
                Relationships: []
            }
            sale_types: {
                Row: {
                    created_at: string
                    id: string
                    is_active: boolean | null
                    name: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    is_active?: boolean | null
                    name: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_active?: boolean | null
                    name?: string
                }
                Relationships: []
            }
            stage_field_requirements: {
                Row: {
                    created_at: string
                    field_name: string
                    id: string
                    is_custom_field: boolean | null
                    is_required: boolean | null
                    stage_id: string
                }
                Insert: {
                    created_at?: string
                    field_name: string
                    id?: string
                    is_custom_field?: boolean | null
                    is_required?: boolean | null
                    stage_id: string
                }
                Update: {
                    created_at?: string
                    field_name?: string
                    id?: string
                    is_custom_field?: boolean | null
                    is_required?: boolean | null
                    stage_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "stage_field_requirements_stage_id_fkey"
                        columns: ["stage_id"]
                        isOneToOne: false
                        referencedRelation: "pipeline_stages"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_permissions: {
                Row: {
                    created_at: string
                    granted: boolean
                    granted_by: string
                    id: string
                    permission_id: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    granted: boolean
                    granted_by: string
                    id?: string
                    permission_id: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    granted?: boolean
                    granted_by?: string
                    id?: string
                    permission_id?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_permissions_permission_id_fkey"
                        columns: ["permission_id"]
                        isOneToOne: false
                        referencedRelation: "permissions"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            current_user_has_permission: {
                Args: {
                    p_permission_code: string
                }
                Returns: boolean
            }
            get_current_user_permissions: {
                Args: Record<PropertyKey, never>
                Returns: Json
            }
            has_permission: {
                Args: {
                    p_user_id: string
                    p_permission_code: string
                }
                Returns: boolean
            }
            has_permission_hierarchical: {
                Args: {
                    p_user_id: string
                    p_module: string
                    p_entity?: string
                    p_action?: string
                }
                Returns: boolean
            }
            is_active_user: {
                Args: Record<PropertyKey, never>
                Returns: boolean
            }
            is_admin: {
                Args: Record<PropertyKey, never>
                Returns: boolean
            }
            log_auth_event: {
                Args: {
                    p_event_type: string
                    p_user_id?: string
                    p_target_user_id?: string
                    p_details?: Json
                }
                Returns: undefined
            }
            update_updated_at_column: {
                Args: Record<PropertyKey, never>
                Returns: unknown
            }
        }
        Enums: {
            company_type: "company" | "manufacturer"
            office_location: "TIA" | "TIC"
            quotation_status: "Draft" | "Sent" | "Accepted" | "Rejected"
            quotation_type: "Direct Importation" | "Nationalized Sale"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof Database["public"]["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof Database["public"]["CompositeTypes"]
    ? Database["public"]["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
