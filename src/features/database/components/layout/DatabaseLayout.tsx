import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';
import { Users, Building2, Factory, Package } from 'lucide-react';

const TABS = [
    { label: 'Contacts', href: '/database/contacts', icon: Users },
    { label: 'Companies', href: '/database/companies', icon: Building2 },
    { label: 'Manufacturers', href: '/database/manufacturers', icon: Factory },
    { label: 'Products', href: '/database/products', icon: Package },
];

export function DatabaseLayout() {
    const location = useLocation();

    return (
        <div className="flex flex-col min-h-full space-y-4">
            <div className="border-b flex items-center space-x-6 sticky top-0 bg-background z-10 pt-2 px-6">
                {TABS.map((tab) => {
                    const isActive = location.pathname.startsWith(tab.href);
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            to={tab.href}
                            className={cn(
                                "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2",
                                isActive
                                    ? "border-primary text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                            )}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </Link>
                    );
                })}
            </div>

            <div className="flex-1">
                <Outlet />
            </div>
        </div >
    );
}
