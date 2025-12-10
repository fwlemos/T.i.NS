import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Database,
    Kanban,
    Package,
    Wrench,
    DollarSign,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Database', icon: Database, href: '/database' },
    { label: 'CRM', icon: Kanban, href: '/crm' },
    { label: 'Orders', icon: Package, href: '/orders' },
    { label: 'Services', icon: Wrench, href: '/services' },
    { label: 'Finances', icon: DollarSign, href: '/finances' },
    { label: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const stored = localStorage.getItem('sidebar-collapsed');
        return stored ? JSON.parse(stored) : false;
    });

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    return (
        <aside
            className={cn(
                "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
                isCollapsed ? "w-16" : "w-60"
            )}
        >
            <div className="flex h-16 items-center justify-between px-4">
                {!isCollapsed && <span className="text-xl font-bold">TIMS</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("ml-auto", isCollapsed && "mx-auto")}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
            </div>

            <nav className="flex-1 space-y-1 p-2">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                isCollapsed && "justify-center px-2"
                            )
                        }
                    >
                        <item.icon size={20} />
                        {!isCollapsed && <span className="ml-3">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
