import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/lib/supabase/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import { Shield } from 'lucide-react'

type Role = Tables<'roles'>

export function RoleList() {
    const { data: roles, isLoading } = useQuery({
        queryKey: ['admin-roles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('roles')
                .select('*')
                .order('hierarchy_level', { ascending: false })
            if (error) throw error
            return data as Role[]
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Roles</h2>
                {/* Placeholder for Add Role button - restricted to admins via RLS/PermissionGate */}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-center">Level</TableHead>
                            <TableHead className="text-center">System Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Loading roles...
                                </TableCell>
                            </TableRow>
                        ) : (
                            roles?.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        {role.name}
                                    </TableCell>
                                    <TableCell>{role.description}</TableCell>
                                    <TableCell className="text-center">{role.hierarchy_level}</TableCell>
                                    <TableCell className="text-center">
                                        {role.is_system_role ? 'Yes' : 'No'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
