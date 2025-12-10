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
            // Successful login is handled by AuthProvider/redirect logic usually
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
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">{t('login.title')}</CardTitle>
                <CardDescription className="text-center">{t('login.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    isLoading={loading}
                >
                    {/* Google Icon could go here */}
                    {t('login.google')}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('login.emailLabel')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <Button className="w-full" type="submit" disabled={loading}>
                        {t('login.submit')}
                    </Button>
                </form>
            </CardContent>
            {/* CardFooter removed as Button is now inside form */}
        </Card>
    );
}

