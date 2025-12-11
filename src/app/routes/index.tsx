import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from './LoginPage';
import AdminPage from './AdminPage';

import { Navigate } from 'react-router-dom';
import { ContactsView } from '@/features/database/views/ContactsView';
import { ContactDetail } from '@/features/database/pages/ContactDetail';
import { CompaniesView } from '@/features/database/views/CompaniesView';
import { CompanyDetail } from '@/features/database/pages/CompanyDetail';
import { ManufacturersView } from '@/features/database/views/ManufacturersView';
import { ManufacturerDetail } from '@/features/database/pages/ManufacturerDetail';
import { ProductsView } from '@/features/database/views/ProductsView';
import { ProductDetail } from '@/features/database/pages/ProductDetail';
import { DatabaseLayout } from '@/features/database/components/layout/DatabaseLayout';

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <MainLayout />,
                children: [
                    { index: true, element: <div className="p-4">Dashboard Content</div> },
                    {
                        path: 'database',
                        element: <DatabaseLayout />,
                        children: [
                            { index: true, element: <Navigate to="contacts" replace /> },
                            { path: 'contacts', element: <ContactsView /> },
                            { path: 'contacts/:id', element: <ContactDetail /> },
                            { path: 'companies', element: <CompaniesView /> },
                            { path: 'companies/:id', element: <CompanyDetail /> },
                            { path: 'manufacturers', element: <ManufacturersView /> },
                            { path: 'manufacturers/:id', element: <ManufacturerDetail /> },
                            { path: 'products', element: <ProductsView /> },
                            { path: 'products/:id', element: <ProductDetail /> },
                        ]
                    },
                    { path: 'crm', element: <div className="p-4">CRM Module Placeholder</div> },
                    { path: 'orders', element: <div className="p-4">Orders Module Placeholder</div> },
                    { path: 'services', element: <div className="p-4">Services Module Placeholder</div> },
                    { path: 'finances', element: <div className="p-4">Finances Module Placeholder</div> },
                    { path: 'settings', element: <div className="p-4">Settings Module Placeholder</div> },
                    { path: 'admin', element: <AdminPage /> },
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
