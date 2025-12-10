import { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Layout, Card, PasswordInput, Button, Logo, MusicVisualizer } from '../components';
import gsap from 'gsap';

const ResetPasswordPage = memo(function ResetPasswordPage() {
    const { isDark } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const iconRef = useRef(null);
    const successRef = useRef(null);

    const { email } = location.state || {};

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Entrance animation
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

            // Icon animation
            if (iconRef.current) {
                gsap.fromTo(
                    iconRef.current,
                    { scale: 0, rotate: -90 },
                    {
                        scale: 1,
                        rotate: 0,
                        duration: 0.5,
                        ease: 'back.out(1.7)',
                        delay: 0.2,
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Success animation
    useEffect(() => {
        if (isSuccess && successRef.current) {
            gsap.fromTo(
                successRef.current,
                { opacity: 0, scale: 0.8, rotate: -5 },
                {
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                }
            );
        }
    }, [isSuccess]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const isPasswordValid = useMemo(() => {
        const p = formData.password;
        return (
            p.length >= 8 &&
            /[A-Z]/.test(p) &&
            /[a-z]/.test(p) &&
            /\d/.test(p) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(p)
        );
    }, [formData.password]);

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!isPasswordValid) {
            newErrors.password = 'Password does not meet requirements';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, isPasswordValid]);

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
        setIsSuccess(true);

        setTimeout(() => {
            navigate('/login');
        }, 3000);
    }, [validateForm, navigate]);

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
                    {!isSuccess ? (
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
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <h1
                                    className={`
                    text-xl sm:text-2xl font-black uppercase tracking-tight mb-1 animate-item
                    ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
                  `}
                                >
                                    Reset Password
                                </h1>
                                <p
                                    className={`
                    text-xs font-medium tracking-wide animate-item
                    ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                  `}
                                >
                                    Create a new password for your account
                                </p>
                                {email && (
                                    <p
                                        className={`
                      text-xs font-bold mt-0.5 animate-item
                      ${isDark ? 'text-zinc-300' : 'text-zinc-700'}
                    `}
                                    >
                                        {email}
                                    </p>
                                )}
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="animate-item">
                                    <PasswordInput
                                        label="New Password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        error={errors.password}
                                        showValidation={true}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="animate-item">
                                    <PasswordInput
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        error={errors.confirmPassword}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="animate-item pt-2">
                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="large"
                                        loading={isLoading}
                                        disabled={!isPasswordValid && formData.password.length > 0}
                                    >
                                        Reset Password
                                    </Button>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* Success State */
                        <div ref={successRef} className="text-center py-6">
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
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
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
                                Password Reset!
                            </h2>
                            <p
                                className={`
                  text-xs font-medium mb-3
                  ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                `}
                            >
                                Your password has been successfully reset.
                            </p>
                            <div className="flex justify-center gap-1">
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

export default ResetPasswordPage;