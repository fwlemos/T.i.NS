import { ReactNode } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/Sheet';

interface AppDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
}

export function AppDrawer({
    open,
    onOpenChange,
    title,
    description,
    children
}: AppDrawerProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="dark w-[600px] overflow-y-auto bg-[#1B1B1B] text-white border-l border-white/10"
                container={document.getElementById('app-drawer-portal')}
            >
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-bold text-white">{title}</SheetTitle>
                    {description && (
                        <SheetDescription className="text-gray-400">
                            {description}
                        </SheetDescription>
                    )}
                </SheetHeader>

                {children}
            </SheetContent>
        </Sheet>
    );
}
