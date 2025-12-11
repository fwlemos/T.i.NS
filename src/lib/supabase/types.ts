export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
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
            audit_logs: {
                Row: {
                    id: string
                    entity_type: string
                    entity_id: string
                    action: 'CREATE' | 'UPDATE' | 'DELETE'
                    changes: Json
                    user_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    entity_type: string
                    entity_id: string
                    action: 'CREATE' | 'UPDATE' | 'DELETE'
                    changes?: Json
                    user_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    entity_type?: string
                    entity_id?: string
                    action?: 'CREATE' | 'UPDATE' | 'DELETE'
                    changes?: Json
                    user_id?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "audit_logs_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            companies: {
                Row: {
                    id: string
                    type: 'company' | 'manufacturer'
                    name: string
                    tax_id: string | null
                    phone: string | null
                    website: string | null
                    address: Json | null
                    notes: string | null
                    contract_validity: string | null
                    contract_file_id: string | null
                    has_exclusivity: boolean | null
                    exclusivity_file_id: string | null
                    created_at: string
                    updated_at: string
                    created_by: string | null
                    updated_by: string | null
                }
                Insert: {
                    id?: string
                    type: 'company' | 'manufacturer'
                    name: string
                    tax_id?: string | null
                    phone?: string | null
                    website?: string | null
                    address?: Json | null
                    notes?: string | null
                    contract_validity?: string | null
                    contract_file_id?: string | null
                    has_exclusivity?: boolean | null
                    exclusivity_file_id?: string | null
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                    updated_by?: string | null
                }
                Update: {
                    id?: string
                    type?: 'company' | 'manufacturer'
                    name?: string
                    tax_id?: string | null
                    phone?: string | null
                    website?: string | null
                    address?: Json | null
                    notes?: string | null
                    contract_validity?: string | null
                    contract_file_id?: string | null
                    has_exclusivity?: boolean | null
                    exclusivity_file_id?: string | null
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                    updated_by?: string | null
                }
                Relationships: []
            }
            contacts: {
                Row: {
                    id: string
                    name: string
                    email: string | null
                    phone: string | null
                    job_title: string | null
                    is_individual: boolean | null
                    company_id: string | null
                    street: string | null
                    complement: string | null
                    neighborhood: string | null
                    city: string | null
                    state_province: string | null
                    country: string | null
                    postal_code: string | null
                    formatted_address: string | null
                    place_id: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                    created_by: string | null
                    updated_by: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    email?: string | null
                    phone?: string | null
                    job_title?: string | null
                    is_individual?: boolean | null
                    company_id?: string | null
                    street?: string | null
                    complement?: string | null
                    neighborhood?: string | null
                    city?: string | null
                    state_province?: string | null
                    country?: string | null
                    postal_code?: string | null
                    formatted_address?: string | null
                    place_id?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                    updated_by?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string | null
                    phone?: string | null
                    job_title?: string | null
                    is_individual?: boolean | null
                    company_id?: string | null
                    street?: string | null
                    complement?: string | null
                    neighborhood?: string | null
                    city?: string | null
                    state_province?: string | null
                    country?: string | null
                    postal_code?: string | null
                    formatted_address?: string | null
                    place_id?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "contacts_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    }
                ]
            }
            manufacturer_banking_accounts: {
                Row: {
                    id: string
                    manufacturer_id: string | null
                    currency: string
                    bank_name: string
                    account_number: string
                    routing_number: string | null
                    swift_code: string | null
                    iban: string | null
                    intermediary_bank: string | null
                    notes: string | null
                    is_primary: boolean | null
                    created_at: string
                    updated_at: string
                    created_by: string | null
                    updated_by: string | null
                }
                Insert: {
                    id?: string
                    manufacturer_id?: string | null
                    currency: string
                    bank_name: string
                    account_number: string
                    routing_number?: string | null
                    swift_code?: string | null
                    iban?: string | null
                    intermediary_bank?: string | null
                    notes?: string | null
                    is_primary?: boolean | null
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                    updated_by?: string | null
                }
                Update: {
                    id?: string
                    manufacturer_id?: string | null
                    currency?: string
                    bank_name?: string
                    account_number?: string
                    routing_number?: string | null
                    swift_code?: string | null
                    iban?: string | null
                    intermediary_bank?: string | null
                    notes?: string | null
                    is_primary?: boolean | null
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "manufacturer_banking_accounts_manufacturer_id_fkey"
                        columns: ["manufacturer_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    }
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
            products: {
                Row: {
                    id: string
                    name: string
                    part_number: string | null
                    manufacturer_id: string | null
                    description: string | null
                    default_warranty_years: number | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                    created_by: string | null
                    updated_by: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    part_number?: string | null
                    manufacturer_id?: string | null
                    description?: string | null
                    default_warranty_years?: number | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                    updated_by?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    part_number?: string | null
                    manufacturer_id?: string | null
                    description?: string | null
                    default_warranty_years?: number | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "products_manufacturer_id_fkey"
                        columns: ["manufacturer_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    }
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
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
