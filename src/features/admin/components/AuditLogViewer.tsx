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
import { format } from 'date-fns'

type AuditLog = Tables<'auth_audit_log'>

export function AuditLogViewer() {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['audit-logs'],
        queryFn: async () => {
            // Will fail with RLS if user doesn't have permissions, handled by error boundary or empty state 
            // (though PermissionGate should prevent rendering)
            const { data, error } = await supabase
                .from('auth_audit_log')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50) // Limit to last 50 for now

            if (error) throw error
            return data as AuditLog[]
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Audit Log</h2>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Target ID</TableHead>
                            <TableHead className="w-[300px]">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Loading logs...
                                </TableCell>
                            </TableRow>
                        ) : logs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No logs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs?.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {format(new Date(log.created_at), 'MMM d, HH:mm:ss')}
                                    </TableCell>
                                    <TableCell className="font-medium">{log.event_type}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {log.user_id || 'System'}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {log.target_user_id || '-'}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs max-w-[300px] truncate">
                                        {JSON.stringify(log.details)}
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
