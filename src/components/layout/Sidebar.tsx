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
    ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
                "relative flex flex-col py-2 transition-all duration-300 ease-in-out bg-[#1B1B1B] text-white",
                isCollapsed ? "w-14 items-center px-2" : "w-48 px-3"
            )}
        >
            {/* Toggle button at top */}
            <div className="flex h-8 items-center justify-end mb-2">
                <button
                    className={cn(
                        "p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors",
                        isCollapsed && "mx-auto"
                    )}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <ChevronLeft size={16} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
                </button>
            </div>

            <nav className="flex-1 space-y-0.5">
                {NAV_ITEMS.filter(item => item.label !== 'Settings').map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                                isCollapsed ? "justify-center px-0 w-10 h-10 mx-auto" : ""
                            )
                        }
                    >
                        <item.icon size={18} strokeWidth={1.5} />
                        {!isCollapsed && <span className="ml-2.5">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section - Settings */}
            <div className="mt-auto space-y-2 mb-2">
                <div className="h-px bg-white/10 mx-4" />
                {NAV_ITEMS.filter(item => item.label === 'Settings').map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-200 justify-center", // Added justify-center
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                                isCollapsed ? "w-10 h-10 mx-auto" : "mx-2"
                            )
                        }
                    >
                        <item.icon size={18} strokeWidth={1.5} />
                        {!isCollapsed && <span className="ml-2.5">{item.label}</span>}
                    </NavLink>
                ))}
            </div>
        </aside>
    );
}
