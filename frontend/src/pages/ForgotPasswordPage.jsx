import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Layout, Card, Input, Button, Logo, MusicVisualizer } from '../components';
import gsap from 'gsap';

const ForgotPasswordPage = memo(function ForgotPasswordPage() {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const iconRef = useRef(null);
    const successRef = useRef(null);

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // GSAP entrance animation
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const elements = containerRef.current.querySelectorAll('.animate-item');

            gsap.fromTo(
                elements,
                { opacity: 0, y: 25 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power3.out',
                }
            );

            // Icon pulse animation
            if (iconRef.current) {
                gsap.fromTo(
                    iconRef.current,
                    { scale: 0, rotate: -180 },
                    {
                        scale: 1,
                        rotate: 0,
                        duration: 0.6,
                        ease: 'back.out(1.7)',
                        delay: 0.3,
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Success animation
    useEffect(() => {
        if (isSubmitted && successRef.current) {
            gsap.fromTo(
                successRef.current,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                }
            );

            // Checkmark draw animation
            const checkmark = successRef.current.querySelector('.checkmark-path');
            if (checkmark) {
                gsap.fromTo(
                    checkmark,
                    { strokeDashoffset: 50 },
                    {
                        strokeDashoffset: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                        delay: 0.3,
                    }
                );
            }
        }
    }, [isSubmitted]);

    const handleChange = useCallback((e) => {
        setEmail(e.target.value);
        if (error) setError('');
    }, [error]);

    const validateForm = useCallback(() => {
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email');
            return false;
        }
        return true;
    }, [email]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            gsap.fromTo(
                containerRef.current.querySelector('form'),
                { x: -8 },
                { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' }
            );
            return;
        }

        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        setIsSubmitted(true);

        setTimeout(() => {
            navigate('/verify-reset', {
                state: {
                    email,
                    type: 'reset'
                }
            });
        }, 2000);
    }, [validateForm, navigate, email]);

    return (
        <Layout showLogo={false} maxWidth="sm">
            <div ref={containerRef}>
                {/* Logo */}
                <div className="flex justify-center mb-5 animate-item">
                    <Logo size="default" />
                </div>

                {/* Visualizer */}
                <div className="flex justify-center mb-5 animate-item">
                    <MusicVisualizer bars={6} height={28} />
                </div>

                <Card variant="elevated" padding="default">
                    {!isSubmitted ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div
                                    ref={iconRef}
                                    className={`
                    w-14 h-14 mx-auto mb-3 flex items-center justify-center
                    border-[2px] transition-colors duration-300
                    ${isDark
                                            ? 'bg-zinc-800 border-zinc-50'
                                            : 'bg-zinc-100 border-zinc-900'
                                        }
                  `}
                                >
                                    <svg
                                        className={`w-7 h-7 ${isDark ? 'text-zinc-50' : 'text-zinc-900'}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                        />
                                    </svg>
                                </div>
                                <h1
                                    className={`
                    text-xl sm:text-2xl font-black uppercase tracking-tight mb-1 animate-item
                    ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
                  `}
                                >
                                    Forgot Password?
                                </h1>
                                <p
                                    className={`
                    text-xs font-medium tracking-wide animate-item
                    ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                  `}
                                >
                                    No worries! Enter your email and we'll send you a reset code.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="animate-item">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        error={error}
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="animate-item">
                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="large"
                                        loading={isLoading}
                                    >
                                        Send Reset Code
                                    </Button>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* Success State */
                        <div ref={successRef} className="text-center py-4">
                            <div
                                className={`
                  w-16 h-16 mx-auto mb-4 flex items-center justify-center
                  border-[2px]
                  ${isDark
                                        ? 'bg-green-900/30 border-green-500'
                                        : 'bg-green-50 border-green-500'
                                    }
                `}
                            >
                                <svg
                                    className="w-8 h-8 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className="checkmark-path"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        strokeDasharray="50"
                                        strokeDashoffset="0"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2
                                className={`
                  text-xl font-black uppercase tracking-tight mb-1
                  ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
                `}
                            >
                                Code Sent!
                            </h2>
                            <p
                                className={`
                  text-xs font-medium
                  ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                `}
                            >
                                Check your email at <span className="font-bold">{email}</span>
                            </p>
                            <div className="mt-3 flex justify-center">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-zinc-500' : 'bg-zinc-400'}`}
                                            style={{
                                                animation: `pulse 1s ease-in-out infinite`,
                                                animationDelay: `${i * 0.2}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Back to Login */}
                    {!isSubmitted && (
                        <div className="mt-6 text-center animate-item">
                            <Link
                                to="/login"
                                className={`
                  inline-flex items-center gap-1.5
                  text-xs font-bold uppercase tracking-wider
                  transition-all duration-200
                  ${isDark
                                        ? 'text-zinc-400 hover:text-zinc-50'
                                        : 'text-zinc-600 hover:text-zinc-900'
                                    }
                `}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Login
                            </Link>
                        </div>
                    )}
                </Card>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
        </Layout>
    );
});

export default ForgotPasswordPage;