
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    ArrowRight,
    Lock,
    Mail,
    Chrome,
    Fingerprint,
    Eye,
    EyeOff,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const inviteToken = searchParams.get('invite');

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate authentication delay
        setTimeout(() => {
            setIsLoading(false);
            navigate('/');
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden font-sans">

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl opacity-50" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[420px] relative z-10 space-y-6"
            >
                {/* Visual Identity */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 mb-2">
                        <Building2 className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Sign in to Rentaru
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-2">
                            Access your properties, payments, leases, and maintenance requests.
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-card/80 border border-border/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl overflow-hidden backdrop-blur-sm">

                    {/* Invite Banner (Conditional) */}
                    {inviteToken && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/30 px-6 py-3 text-center">
                            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                You’ve been invited to join Skyline Properties
                            </p>
                        </div>
                    )}

                    <div className="p-6 md:p-8 space-y-6">

                        {/* Primary / Passwordless Actions */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                Fastest way to sign in
                            </div>
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 p-2.5 rounded-lg bg-foreground text-background hover:opacity-90 transition-all font-medium border border-transparent shadow-sm"
                            >
                                <Fingerprint size={18} /> Continue with Passkey
                            </button>
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 p-2.5 rounded-lg border bg-background hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-foreground/80 font-medium"
                            >
                                <Chrome size={18} /> Continue with Google
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/60" />
                            </div>
                            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="bg-card px-3 text-muted-foreground/60">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-4">
                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider ml-0.5">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-2.5 text-muted-foreground/80 group-focus-within:text-primary transition-colors duration-200" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="email@company.com"
                                            autoFocus
                                            className="w-full bg-background border border-input rounded-lg py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between ml-0.5">
                                        <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Password</label>
                                        <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">Forgot your password?</a>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-2.5 text-muted-foreground/80 group-focus-within:text-primary transition-colors duration-200" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-background border border-input rounded-lg py-2 pl-10 pr-10 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="space-y-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={cn(
                                        "w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20",
                                        isLoading && "opacity-80 cursor-wait"
                                    )}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">Signing you in...</span>
                                    ) : (
                                        <>
                                            Sign In <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground opacity-80">
                                    <ShieldCheck size={12} /> Secure sign-in
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="text-center">
                    {inviteToken ? (
                        <p className="text-sm text-muted-foreground">
                            Have an invite? <a href="#" className="font-medium text-primary hover:underline">Get started</a>
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            New to Rentaru? <a href="#" className="font-medium text-primary hover:underline">Create an account</a>
                        </p>
                    )}
                </div>

            </motion.div>
        </div>
    );
}
