import { LoginForm } from '@/features/auth/components/LoginForm';

export function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <LoginForm />
        </div>
    );
}
