import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { MoreHorizontal, Shield, UserX, UserCheck } from 'lucide-react'
import { format } from 'date-fns'
import { PermissionGate } from '@/components/auth/PermissionGate'
import { toast } from 'sonner' // Assuming existing toast provider uses sonner or similar

type Profile = Tables<'profiles'> & {
    roles: Tables<'roles'> | null
}

export function UserList() {
    const [search, setSearch] = useState('')
    const queryClient = useQueryClient()

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users', search],
        queryFn: async () => {
            let query = supabase
                .from('profiles')
                .select('*, roles(name)')
                .order('created_at', { ascending: false })

            if (search) {
                query = query.ilike('full_name', `%${search}%`)
            }

            const { data, error } = await query
            if (error) throw error
            return data as Profile[]
        },
    })

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: isActive })
                .eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            toast.success('User status updated')
        },
        onError: (error) => {
            toast.error(`Error: ${error.message}`)
        },
    })

    // Placeholder for role update (needs a dialog)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Users</h2>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : users?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users?.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.full_name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-3 w-3 text-muted-foreground" />
                                            {user.roles?.name || 'No Role'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.is_active ? (
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500/15 text-green-700 dark:text-green-400">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive/15 text-destructive dark:text-red-400">
                                                Inactive
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <PermissionGate permission="settings.users.edit">
                                                    <DropdownMenuItem
                                                        onClick={() => toggleStatusMutation.mutate({
                                                            id: user.id,
                                                            isActive: !user.is_active
                                                        })}
                                                    >
                                                        {user.is_active ? (
                                                            <>
                                                                <UserX className="mr-2 h-4 w-4" /> Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="mr-2 h-4 w-4" /> Activate
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                </PermissionGate>
                                                {/* Add Edit Role Item here later */}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
