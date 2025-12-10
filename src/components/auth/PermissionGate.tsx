import React from 'react'
import { useHasPermission } from '@/features/auth/hooks/usePermissions'

interface PermissionGateProps {
    permission: string
    children: React.ReactNode
    fallback?: React.ReactNode
}

/**
 * Conditionally renders children based on user permission.
 * This is for UI/UX only - server-side RLS provides actual security.
 * 
 * Usage example:
 * <PermissionGate permission="crm.opportunities.edit">
 *   <EditButton onClick={handleEdit} />
 * </PermissionGate>
 */
export function PermissionGate({
    permission,
    children,
    fallback = null
}: PermissionGateProps) {
    const hasPermission = useHasPermission(permission)

    if (!hasPermission) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
