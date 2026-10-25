
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Sparkles,
  BookOpen,
  Users,
  GitBranch,
  Clapperboard,
  Mail,
  Lock,
  User,
  Chrome,
  AlertCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function GoogleSignInButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      id="google-sign-in-btn"
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
          fill="#4285F4"
        />
        <path
          d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
          fill="#34A853"
        />
        <path
          d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
          fill="#FBBC05"
        />
        <path
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
          fill="#EA4335"
        />
      </svg>

      {loading ? 'Signing in…' : 'Continue with Google'}
    </button>
  );
}

function EmailForm() {
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function friendlyError(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';

      case 'auth/email-already-in-use':
        return 'That email is already registered. Try signing in instead.';

      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';

      case 'auth/invalid-email':
        return 'Please enter a valid email address.';

      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';

      default:
        return 'Something went wrong. Please try again.';
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setMode((current) =>
      current === 'signin' ? 'signup' : 'signin'
    );
    setError('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <div className="relative">
          <User
            size={15}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            id="signup-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input pl-9"
            autoComplete="name"
          />
        </div>
      )}

      <div className="relative">
        <Mail
          size={15}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          id="email-input"
          name="email"
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input pl-9"
          autoComplete="email"
        />
      </div>

      <div className="relative">
        <Lock
          size={15}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          id="password-input"
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input pl-9"
          autoComplete={
            mode === 'signup' ? 'new-password' : 'current-password'
          }
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
        >
          <AlertCircle
            size={14}
            aria-hidden="true"
            className="shrink-0 mt-0.5"
          />
          <span>{error}</span>
        </div>
      )}

      <button
        id="email-submit-btn"
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading
          ? mode === 'signup'
            ? 'Creating account…'
            : 'Signing in…'
          : mode === 'signup'
            ? 'Create Account'
            : 'Sign In'}
      </button>

      <p className="text-center text-sm text-gray-500">
        {mode === 'signin'
          ? "Don't have an account? "
          : 'Already have an account? '}

        <button
          id="toggle-mode-btn"
          type="button"
          onClick={toggleMode}
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          {mode === 'signin' ? 'Sign up free' : 'Sign in'}
        </button>
      </p>
    </form>
  );
}

function Feature({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center shrink-0">
        <Icon size={13} className="text-indigo-400" aria-hidden="true" />
      </div>
      <span>{label}</span>
    </div>
  );
}

export function LandingPage() {
  const { signInWithGoogle } = useAuth();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [showEmail, setShowEmail] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleError('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';

      if (code !== 'auth/popup-closed-by-user') {
        setGoogleError('Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Hero panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
            <Sparkles size={20} className="text-white" />
          </div>

          <div>
            <p className="font-serif font-bold text-white text-xl leading-none">
              StoryVerse
            </p>
            <span className="text-indigo-400 text-xs font-medium">
              AI ✦
            </span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="font-serif text-5xl xl:text-6xl font-bold text-white leading-tight mb-4">
              Your stories,
              <br />
              <span className="text-gradient">your universe.</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-md leading-relaxed">
              Craft characters, simulate scenes, and explore every
              alternate path of your story — all in one place. Your
              creative world, private to you.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            <Feature
              icon={BookOpen}
              label="AI-powered story editor"
            />
            <Feature
              icon={Users}
              label="Rich character builder"
            />
            <Feature
              icon={Clapperboard}
              label="Scene simulator & dialogue"
            />
            <Feature
              icon={GitBranch}
              label="Explore alternate story paths"
            />
          </div>
        </div>

        {/* Testimonial */}
        <div className="glass rounded-2xl p-5 relative z-10 max-w-sm">
          <p className="text-sm text-gray-300 italic leading-relaxed mb-3">
            "Finally, a writing tool that understands how stories work —
            not just words on a page, but worlds with real depth."
          </p>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
              J
            </div>
            <span className="text-xs text-gray-500">
              Jordan K. — Fantasy author
            </span>
          </div>
        </div>
      </div>

      {/* Right: Authentication panel */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center p-8 lg:p-12 border-l border-white/5">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>

          <div>
            <p className="font-serif font-bold text-white text-lg leading-none">
              StoryVerse
            </p>
            <span className="text-indigo-400 text-xs">AI ✦</span>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-white mb-2">
              Welcome back
            </h2>
            <p className="text-gray-400">
              Sign in to access your stories
            </p>
          </div>

          {/* Google sign-in */}
          <div className="space-y-3">
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              loading={googleLoading}
            />

            {googleError && (
              <p
                role="alert"
                className="text-sm text-red-400 text-center flex items-center justify-center gap-1.5"
              >
                <AlertCircle size={13} aria-hidden="true" />
                {googleError}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email sign-in / sign-up */}
          {showEmail ? (
            <EmailForm />
          ) : (
            <button
              id="show-email-btn"
              type="button"
              onClick={() => setShowEmail(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium text-sm transition-all duration-200 active:scale-95"
            >
              <Chrome size={16} aria-hidden="true" />
              Continue with Email
            </button>
          )}

          <p className="text-xs text-gray-600 text-center leading-relaxed">
            By signing in, you agree that your data is private to your
            account only. We never share your stories.
          </p>
        </div>
      </div>
    </div>
  );
}
