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
