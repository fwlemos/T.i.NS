import { useTheme } from '@/app/providers/ThemeProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Sun, Moon, LogOut, Search } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export function TopBar() {
    const { theme, setTheme } = useTheme();
    const { user, signOut } = useAuth();

    return (
        <div className="flex h-14 items-center justify-between px-4 bg-[#1B1B1B]">
            {/* Logo - Left Section */}
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white text-[#1B1B1B] flex items-center justify-center font-bold text-sm">T</div>
                <span className="text-lg font-bold tracking-tight text-white">T(i)NS</span>
            </div>

            {/* Search Bar Placeholder - Center Section */}
            <div className="flex-1 max-w-xl mx-8">
                <div className="flex items-center h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed">
                    <Search size={16} className="mr-2" />
                    <span className="text-sm">Search... (coming soon)</span>
                </div>
            </div>

            {/* Right Section - Theme Toggle & User */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* User Avatar Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-white/20 hover:ring-white/40 transition-all">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.user_metadata?.avatar_url} />
                                <AvatarFallback className="bg-gray-600 text-white text-sm">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut} className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
