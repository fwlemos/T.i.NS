import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Calendar, User, Clock, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDistanceToNow } from 'date-fns';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface EntityHeaderProps {
    title: string;
    subtitle?: string | null;
    createdAt?: string | null;
    createdById?: string | null;
    icon?: React.ElementType;
    badgeText?: string;
    badgeColor?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    isEditing?: boolean;
    onCancel?: () => void;
}

export function EntityHeader({
    title,
    subtitle,
    createdAt,
    createdById,
    icon: Icon,
    badgeText,
    badgeColor = 'bg-blue-100 text-blue-800',
    onEdit,
    onDelete,
    isEditing,
    onCancel
}: EntityHeaderProps) {
    const [creator, setCreator] = useState<Profile | null>(null);

    useEffect(() => {
        async function fetchCreator() {
            if (!createdById) return;
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', createdById)
                .single();

            if (data) setCreator(data);
        }
        fetchCreator();
    }, [createdById]);

    return (
        <div className="flex flex-col space-y-4 pb-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="h-8 w-8 text-gray-400" />}
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                        {badgeText && (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                                {badgeText}
                            </span>
                        )}
                    </div>
                    {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" size="sm" onClick={onCancel}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            {onEdit && (
                                <Button variant="outline" size="sm" onClick={onEdit}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            )}
                            {onDelete && (
                                <Button variant="destructive" size="sm" onClick={onDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                {createdAt && (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(createdAt).toLocaleDateString()}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <Clock className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
                    </div>
                )}

                {creator && (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Created by <span className="font-medium text-foreground">{creator.full_name || 'Unknown'}</span></span>
                    </div>
                )}
            </div>
        </div>
    );
}
