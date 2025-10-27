'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/api/services';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loginAsGuest } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }

    try {
      setLoading(true);
      await authService.sendCode({ email });
      showToast('Verification code sent to your email', 'success');
      setStep('code');
    } catch (error: any) {
      showToast(
        error?.response?.data?.error || 'Failed to send code. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      showToast('Please enter the 6-digit code', 'error');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, code);
      showToast('Successfully logged in!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Invalid code. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      await loginAsGuest();
      showToast('Browsing as guest', 'success');
      router.push('/');
    } catch (error: any) {
      showToast('Failed to continue as guest', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-light-bg dark:via-dark-bg to-accent/10 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 rounded-full bg-primary items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Welcome to GoGevgelija
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Sign in to access your wishlist and personalized content
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-light-card dark:bg-dark-card rounded-lg p-6 shadow-md border border-light-border dark:border-dark-border">
          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                  Verification Code
                </label>
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  autoFocus
                  maxLength={6}
                />
                <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Enter the 6-digit code sent to <strong>{email}</strong>
                </p>
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Verify & Sign In
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                }}
                className="w-full text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
              >
                ← Back to email
              </button>
            </form>
          )}

          {/* Guest Login */}
          {step === 'email' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-light-border dark:border-dark-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-light-card dark:bg-dark-card text-light-text-secondary dark:text-dark-text-secondary">
                    or
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGuestLogin}
                loading={loading}
              >
                Continue as Guest
              </Button>
            </>
          )}
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:text-primary/80 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
