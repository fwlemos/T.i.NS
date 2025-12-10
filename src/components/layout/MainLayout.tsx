import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function MainLayout() {
    return (
        <div className="flex flex-col h-screen w-full bg-[#1B1B1B] text-foreground overflow-hidden">
            {/* Dark Top Bar with theme toggle and user avatar */}
            <TopBar />

            {/* Main area: Sidebar + Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Dark Sidebar */}
                <Sidebar />

                {/* Main Content Area - Rounded left corners, with top/bottom padding */}
                <div className="flex-1 flex flex-col h-full relative pt-2 pb-4 pr-0 pl-0">
                    <main className="flex-1 flex flex-col bg-background rounded-l-2xl overflow-hidden relative">
                        <div className="flex-1 overflow-auto p-4 md:p-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
