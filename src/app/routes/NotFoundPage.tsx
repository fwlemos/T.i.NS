import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
    return (
        <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
                <Link to="/">Go Home</Link>
            </Button>
        </div>
    );
}
