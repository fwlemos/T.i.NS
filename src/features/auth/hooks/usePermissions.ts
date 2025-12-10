import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'


// Type for the RPC return value
// Based on: RETURN json_build_object('role_name', v_role_name, 'permissions', ...)
type UserPermissionsData = {
    role_name: string | null
    permissions: string[]
}

interface UserPermissions {
    permissions: string[]
    role: string | null
    isAdmin: boolean
}

/**
 * Hook to get current user's permissions.
 * Results are cached and used for UI rendering.
 * 
 * IMPORTANT: These permissions are for UI/UX only.
 * All actual permission checks happen server-side via RLS.
 */
export function usePermissions() {
    return useQuery({
        queryKey: ['user-permissions'],
        queryFn: async (): Promise<UserPermissions> => {
            // Calls the RPC function 'get_current_user_permissions'
            const { data, error } = await supabase.rpc('get_current_user_permissions')

            if (error) {
                console.error('Error fetching permissions:', error)
                // Return safe defaults on error rather than crashing
                return {
                    permissions: [],
                    role: null,
                    isAdmin: false
                }
            }

            // Cast the JSON response to our expected type
            const result = data as unknown as UserPermissionsData

            return {
                permissions: result.permissions || [],
                role: result.role_name,
                isAdmin: result.role_name === 'admin',
            }
        },
        // Cache for 5 minutes, but stale only for 1 minute so we re-fetch if window refocused after a while 
        // to catch role changes.
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
    })
}

/**
 * Check if current user has a specific permission.
 * For UI rendering only - actual security is server-side.
 */
export function useHasPermission(permissionCode: string): boolean {
    const { data } = usePermissions()
    return data?.permissions.includes(permissionCode) ?? false
}

/**
 * Check if current user is an admin.
 * For UI rendering only.
 */
export function useIsAdmin(): boolean {
    const { data } = usePermissions()
    return data?.isAdmin ?? false
}
