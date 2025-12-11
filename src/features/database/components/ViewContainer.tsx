import { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface ViewContainerProps {
    title: string;
    description?: string;
    onCreate?: () => void;
    createLabel?: string;
    children: ReactNode;
    actions?: ReactNode;
}

export function ViewContainer({
    title,
    description,
    onCreate,
    createLabel = 'Create New',
    children,
    actions
}: ViewContainerProps) {
    return (
        <div className="h-full flex flex-col space-y-6 p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    {description && (
                        <p className="text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    {actions}
                    {onCreate && (
                        <Button onClick={onCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            {createLabel}
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
