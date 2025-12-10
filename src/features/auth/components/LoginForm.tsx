import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useToast } from '@/app/providers/ToastProvider';

export function LoginForm() {
    const { t } = useTranslation('auth');
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await authService.signInWithGoogle();
            if (error) throw error;
        } catch (error) {
            toast({
                type: 'error',
                message: t('errors.generic', { ns: 'common' }),
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await authService.signInWithPassword(email, password);
            if (error) throw error;
        } catch (error: any) {
            toast({
                type: 'error',
                message: error.message || t('errors.generic', { ns: 'common' }),
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-tertiary p-4">
            <div className="mb-8 flex flex-col items-center">
                <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4 shadow-lg">T</div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">T(i)NS</h1>
                <p className="text-muted-foreground mt-2">Tennessine (integrated) Network System</p>
            </div>

            <Card className="w-full max-w-sm border-0 shadow-xl bg-background/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-xl font-semibold text-center">{t('login.title')}</CardTitle>
                    <CardDescription className="text-center">{t('login.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full h-11 relative"
                        onClick={handleGoogleLogin}
                        isLoading={loading}
                    >
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        {t('login.google')}
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-medium uppercase text-muted-foreground ml-1">{t('login.emailLabel')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@tennessine.com.br"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                                className="bg-secondary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-medium uppercase text-muted-foreground ml-1">{t('login.passwordLabel')}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                                className="bg-secondary/50"
                            />
                        </div>
                        <Button className="w-full h-11 font-semibold" type="submit" disabled={loading}>
                            {t('login.submit')}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-muted-foreground max-w-xs">
                <p>&copy; {new Date().getFullYear()} Tennessine. All rights reserved.</p>
            </div>
        </div>
    );
}

