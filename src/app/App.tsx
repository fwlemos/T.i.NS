import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
import { AppRoutes } from './routes';
import '@/lib/i18n/config';

import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

function App() {
    return (
        <QueryProvider>
            <ErrorBoundary>
                <ThemeProvider>
                    <AuthProvider>
                        <ToastProvider>
                            <AppRoutes />
                        </ToastProvider>
                    </AuthProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </QueryProvider>
    );
}

export default App;
