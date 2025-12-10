import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from './LoginPage';

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <MainLayout />,
                children: [
                    { index: true, element: <div className="p-4">Dashboard Content</div> },
                    { path: 'database', element: <div className="p-4">Database Module Placeholder</div> },
                    { path: 'crm', element: <div className="p-4">CRM Module Placeholder</div> },
                    { path: 'orders', element: <div className="p-4">Orders Module Placeholder</div> },
                    { path: 'services', element: <div className="p-4">Services Module Placeholder</div> },
                    { path: 'finances', element: <div className="p-4">Finances Module Placeholder</div> },
                    { path: 'settings', element: <div className="p-4">Settings Module Placeholder</div> },
                ],
            },
        ],
    },
    {
        element: <PublicRoute />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
        ],
    },
    {
        path: '*',
        element: <div className="p-4">404 Not Found</div>,
    },
]);

export function AppRoutes() {
    return <RouterProvider router={router} />;
}
