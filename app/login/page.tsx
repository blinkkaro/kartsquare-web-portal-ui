import LoginView from '@/components/pages/Login';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | KartSquare Portal',
    description: 'Login to your account',
};

export default function LoginPage() {
    return <LoginView />;
}
