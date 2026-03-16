import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.528-3.108-11.127-7.481l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C44.577,34,48,27.461,48,20C48,16.9,47.4,14,46.1,11.5z"></path>
    </svg>
);

const AppleIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19.1,11.43c0,1.34-1.24,2.78-1.24,2.78s1.46.9,1.46,2.69a4.8,4.8,0,0,1-1.4,3.28,4.36,4.36,0,0,1-3.32,1.34,4.2,4.2,0,0,1-1.63-.32,4.36,4.36,0,0,1-2.92-2.3,10.15,10.15,0,0,1-1.24-.08,10.27,10.27,0,0,1-1.24.08,4.36,4.36,0,0,1-2.92,2.3,4.2,4.2,0,0,1-1.63.32,4.36,4.36,0,0,1-3.32-1.34,4.8,4.8,0,0,1-1.4-3.28c0-1.79,1.46-2.69,1.46-2.69s-1.24-1.44-1.24-2.78a5.21,5.21,0,0,1,1.71-3.8,4.6,4.6,0,0,1,3.48-1.55,4.33,4.33,0,0,1,3.16,1.48,4.33,4.33,0,0,1,3.16-1.48,4.6,4.6,0,0,1,3.48,1.55,5.21,5.21,0,0,1,1.71,3.8m-5.1-4.75a3.9,3.9,0,0,0-2.84.9,4.41,4.41,0,0,0-1.24,3.2,4.07,4.07,0,0,0,1.16,2.84c.68.76,1.48,1,2.92,1a.36.36,0,0,1,.16,0,3.9,3.9,0,0,0,2.84-.9,4.41,4.41,0,0,0,1.24-3.2,4.07,4.07,0,0,0-1.16-2.84c-.76-.68-1.55-1-2.92-1a.36.36,0,0,1-.16,0"></path>
    </svg>
);


interface AuthPageProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onSignUp: (newUser: { name: string; handle: string; email: string; password?: string }) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignUp }) => {
    const [mode, setMode] = useState<'signIn' | 'signUp'>('signUp');
    const [name, setName] = useState('');
    const [handle, setHandle] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const handleModeToggle = () => {
        setMode(prev => (prev === 'signIn' ? 'signUp' : 'signIn'));
        setError('');
        setName('');
        setHandle('');
        setEmail('');
        setPassword('');
    };

    const handleSignInSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        if (!email || !password) {
            setError(t('auth_error_all_fields'));
            setLoading(false);
            return;
        }
        onLogin({ email, password });
        // Loading is handled by App component, but we can set it to false after a delay
        // to handle error cases where onLogin returns early.
        setTimeout(() => setLoading(false), 1500);
    };

    const handleSignUpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        if (!name || !handle || !email || !password) {
            setError(t('auth_error_all_fields'));
            setLoading(false);
            return;
        }
        onSignUp({ name, handle, email, password });
        setTimeout(() => setLoading(false), 1500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-surface dark:bg-dark-background p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-on-surface dark:text-dark-on-surface">
                        {mode === 'signIn' ? 'Welcome back' : 'Create your account'}
                    </h1>
                    <p className="mt-2 text-on-surface-secondary dark:text-dark-on-surface-secondary">
                        {mode === 'signIn' ? "Sign in to continue to Cascade" : "Let's get you started."}
                    </p>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-background dark:bg-dark-surface border border-border dark:border-dark-border rounded-md hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors">
                            <GoogleIcon />
                            <span className="text-sm font-semibold">Google</span>
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-background dark:bg-dark-surface border border-border dark:border-dark-border rounded-md hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors">
                            <AppleIcon />
                            <span className="text-sm font-semibold">Apple</span>
                        </button>
                    </div>
                    
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-border dark:border-dark-border"></div>
                        <span className="flex-shrink mx-4 text-xs uppercase text-on-surface-secondary dark:text-dark-on-surface-secondary">Or</span>
                        <div className="flex-grow border-t border-border dark:border-dark-border"></div>
                    </div>

                    <form onSubmit={mode === 'signIn' ? handleSignInSubmit : handleSignUpSubmit} className="space-y-4">
                        {mode === 'signUp' && (
                             <div>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder={t('auth_name')} className="w-full bg-background dark:bg-dark-surface border border-border dark:border-dark-border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        )}
                         {mode === 'signUp' && (
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-on-surface-secondary dark:text-dark-on-surface-secondary">@</span>
                                <input type="text" id="handle" value={handle} onChange={(e) => setHandle(e.target.value)} required placeholder={t('auth_handle')} className="w-full bg-background dark:bg-dark-surface border border-border dark:border-dark-border rounded-md shadow-sm py-3 px-4 pl-8 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                         )}
                         <div>
                            <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={mode === 'signIn' ? 'Handle or Email' : 'Email'} className="w-full bg-background dark:bg-dark-surface border border-border dark:border-dark-border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                         <div>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder={t('auth_password')} className="w-full bg-background dark:bg-dark-surface border border-border dark:border-dark-border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                                {loading ? '...' : (mode === 'signIn' ? 'Sign In' : 'Create Account')}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-sm text-on-surface-secondary dark:text-dark-on-surface-secondary">
                    {mode === 'signIn' ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={handleModeToggle} className="ml-1 font-medium text-primary hover:underline">
                        {mode === 'signIn' ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
