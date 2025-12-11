import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Loader2, Users, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import { DeleteAlertDialog } from '@/components/ui/DeleteAlertDialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { ContactForm } from '../forms/ContactForm';
import { toast } from 'sonner';

type Contact = Database['public']['Tables']['contacts']['Row'];

interface CompanyEmployeesSectionProps {
    companyId: string;
}

export function CompanyEmployeesSection({ companyId }: CompanyEmployeesSectionProps) {
    const [employees, setEmployees] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingEmployee, setEditingEmployee] = useState<Contact | null>(null);
    const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    async function fetchEmployees() {
        setLoading(true);
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching company employees:', error);
        } else {
            setEmployees(data || []);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (companyId) {
            fetchEmployees();
        }
    }, [companyId]);

    const handleDeleteClick = (employee: Contact) => {
        setDeletingEmployeeId(employee.id);
    };

    const handleConfirmDelete = async () => {
        if (!deletingEmployeeId) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase.from('contacts').delete().eq('id', deletingEmployeeId);
            if (error) throw error;
            toast.success('Employee removed successfully');
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast.error('Failed to remove employee');
        } finally {
            setIsDeleting(false);
            setDeletingEmployeeId(null);
        }
    };

    const handleEditClick = (employee: Contact) => {
        setEditingEmployee(employee);
    };

    const handleUpdateSubmit = async (data: any) => {
        if (!editingEmployee) return;
        try {
            // Remove RelationalField specific props if present in data but not in schema/table update
            // ContactForm generally handles this, but careful with readonly/nested logic
            const { error } = await supabase
                .from('contacts')
                .update(data)
                .eq('id', editingEmployee.id);

            if (error) throw error;
            toast.success('Employee updated successfully');
            setEditingEmployee(null);
            fetchEmployees();
        } catch (error) {
            console.error('Error updating employee:', error);
            toast.error('Failed to update employee');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Employees ({employees.length})
                </h3>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No employees found for this company.
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.map((employee) => (
                                <TableRow key={employee.id} className="hover:bg-muted/50 group">
                                    <TableCell className="font-medium">
                                        <Link
                                            to={`/database/contacts/${employee.id}`}
                                            className="text-primary hover:underline"
                                        >
                                            {employee.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{employee.job_title || '-'}</TableCell>
                                    <TableCell>{employee.email || '-'}</TableCell>
                                    <TableCell>{employee.phone || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEditClick(employee)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteClick(employee)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <DeleteAlertDialog
                open={!!deletingEmployeeId}
                onOpenChange={(open) => !open && setDeletingEmployeeId(null)}
                title="Remove Employee"
                description="Are you sure you want to remove this employee? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />

            <Sheet open={!!editingEmployee} onOpenChange={(open) => !open && setEditingEmployee(null)}>
                <SheetContent className="overflow-y-auto" container={document.getElementById('database-drawer-container')}>
                    <SheetHeader>
                        <SheetTitle>Edit Employee</SheetTitle>
                        <SheetDescription>Make changes to the employee details.</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        {editingEmployee && (
                            <ContactForm
                                initialData={editingEmployee}
                                onSubmit={handleUpdateSubmit}
                                isLoading={false}
                            />
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
