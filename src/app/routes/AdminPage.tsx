import { PermissionGate } from '@/components/auth/PermissionGate'
import { UserList } from '@/features/admin/components/UserList'
import { RoleList } from '@/features/admin/components/RoleList'
import { AuditLogViewer } from '@/features/admin/components/AuditLogViewer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { ShieldAlert } from 'lucide-react'

export default function AdminPage() {
    return (
        <div className="space-y-8 p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
                <p className="text-muted-foreground">
                    Manage users, roles, and view security logs.
                </p>
            </div>

            <div className="grid gap-8">
                {/* User Management Section */}
                <PermissionGate permission="settings.users.view">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage user access and status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserList />
                        </CardContent>
                    </Card>
                </PermissionGate>

                {/* Role Management Section */}
                <div className="grid gap-8 md:grid-cols-2">
                    <PermissionGate permission="settings.roles.view">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Roles & Hierarchy</CardTitle>
                                <CardDescription>System roles and permission levels.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RoleList />
                            </CardContent>
                        </Card>
                    </PermissionGate>

                    {/* Audit Log Section */}
                    <PermissionGate permission="settings.audit.view">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5" /> Security Audit Log
                                </CardTitle>
                                <CardDescription>Recent security events.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AuditLogViewer />
                            </CardContent>
                        </Card>
                    </PermissionGate>
                </div>
            </div>
        </div>
    )
}
