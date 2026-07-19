import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../../services/auth';
import { Input } from '../../components/ui/Input';
import { Loader2, GraduationCap, CheckCircle, RefreshCw } from 'lucide-react';

const quotes = [
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" }
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quote rotation state
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Form field errors
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Auto rotate quotes every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextQuote();
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleNextQuote = () => {
    setFade(false);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
      setFade(true);
    }, 300);
  };

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await loginWithEmail(email, password);

      if (data.user) {
        if (data.user.identities && data.user.identities.length > 0 && !data.user.email_confirmed_at) {
          setError('Please verify your email address first. Check your inbox for the confirmation link.');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (
        msg.toLowerCase().includes('confirm') || 
        msg.toLowerCase().includes('verify') ||
        err.code === 'email_not_confirmed'
      ) {
        setError('Please verify your email address first. Check your inbox for the confirmation link.');
      } else {
        setError(msg || 'An unexpected error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during Google Sign In.');
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg('Password reset instructions will be sent if the email exists.');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900">
      
      {/* Left side: Premium Shifting Gradient & Floating Blobs Banner (Wider canvas) */}
      <div className="flex-grow hidden lg:flex relative bg-gradient-to-tr from-indigo-950 via-purple-950 to-slate-950 p-16 flex-col justify-between overflow-hidden text-white border-r border-indigo-950/20 animate-gradient-shift">
        
        {/* Constellation of floating blurred colorful blobs */}
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none animate-float-slow-1" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-3xl pointer-events-none animate-float-slow-2" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl pointer-events-none animate-float-slow-1" />
        <div className="absolute bottom-1/3 left-10 w-72 h-72 rounded-full bg-pink-600/5 blur-3xl pointer-events-none animate-float-slow-2" />
        
        {/* Subtle grid pattern background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:16px_28px] pointer-events-none" />
        
        {/* Logo/Brand */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30 transition-transform duration-300 hover:rotate-12 cursor-pointer">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
            LMS Platform
          </span>
        </div>

        {/* Content & Interactive Rotating Glassmorphic Quote Card */}
        <div className="relative z-10 space-y-12 my-auto max-w-2xl">
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative group overflow-hidden transition-all duration-500 hover:border-indigo-500/30 hover:shadow-indigo-500/10">
            {/* Hover card lighting highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
                  💡 Inspirational Quote
                </span>
                
                {/* Manual cycle button */}
                <button 
                  onClick={handleNextQuote}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors duration-200"
                  title="Next Quote"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className={`transition-all duration-300 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-100 transition-all duration-300 group-hover:text-white">
                  "{quotes[quoteIndex].text}"
                </blockquote>
                <cite className="block text-sm text-slate-400 font-semibold not-italic mt-4">
                  — {quotes[quoteIndex].author}
                </cite>
              </div>
            </div>
          </div>

          {/* Quick study features checklist with hover interactions */}
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 transition-all duration-200 hover:translate-x-1.5 hover:text-white cursor-default group">
              <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Structured study paths and courses</span>
            </div>
            <div className="flex items-center gap-3 transition-all duration-200 hover:translate-x-1.5 hover:text-white cursor-default group">
              <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Interactive peer discussions & assignments</span>
            </div>
            <div className="flex items-center gap-3 transition-all duration-200 hover:translate-x-1.5 hover:text-white cursor-default group">
              <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Personalized dashboard tracking progress</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} LMS Study Portal. All rights reserved.
        </div>
      </div>

      {/* Right side: Login form (Compact sidebar width, letting the banner occupy maximum space) */}
      <div className="w-full lg:w-[400px] shrink-0 bg-white border-l border-slate-100/80 shadow-2xl p-8 sm:p-12 flex flex-col justify-center animate-slide-up z-10">
        <div className="w-full max-w-sm mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Sign In
            </h2>
            <p className="text-sm text-slate-500">
              Access your personalized study portal
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600" role="alert">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-600" role="alert">
              {successMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleEmailLogin}>
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
                disabled={loading}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                disabled={loading}
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  'Login'
                )}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full justify-center items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.67 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-slate-500">
            I don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
