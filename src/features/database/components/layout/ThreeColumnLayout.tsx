import { ReactNode } from 'react';

interface ThreeColumnLayoutProps {
    leftContent: ReactNode;
    centerContent: ReactNode;
    rightContent: ReactNode;
}

export function ThreeColumnLayout({
    leftContent,
    centerContent,
    rightContent,
}: ThreeColumnLayoutProps) {
    return (
        <div className="flex flex-col lg:flex-row h-full min-h-screen bg-gray-50/50 dark:bg-gray-950">
            {/* Left Column - Fixed Width */}
            <aside className="w-full lg:w-[280px] xl:w-[320px] flex-shrink-0 border-r bg-background overflow-y-auto">
                {leftContent}
            </aside>

            {/* Center Column - Flexible */}
            <main className="flex-1 overflow-y-auto min-w-0">
                <div className="max-w-4xl mx-auto p-4 md:p-8">
                    {centerContent}
                </div>
            </main>

            {/* Right Column - Fixed Width */}
            <aside className="w-full lg:w-[300px] xl:w-[350px] flex-shrink-0 border-l bg-background overflow-y-auto">
                {rightContent}
            </aside>
        </div>
    );
}
