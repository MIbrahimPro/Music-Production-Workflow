import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Layout, Card, Input, PasswordInput, Button, Logo, MusicVisualizer } from '../components';
import gsap from 'gsap';

const LoginPage = memo(function LoginPage() {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // GSAP entrance animation
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const elements = containerRef.current.querySelectorAll('.animate-item');

            gsap.fromTo(
                elements,
                { opacity: 0, y: 25, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power3.out',
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        navigate('/role-selection');
    }, [validateForm, navigate]);

    return (
        <Layout showLogo={false} maxWidth="sm">
            <div ref={containerRef}>
                {/* Logo */}
                <div className="flex justify-center mb-5 animate-item">
                    <Logo size="large" />
                </div>

                {/* Visualizer */}
                <div className="flex justify-center mb-5 animate-item">
                    <MusicVisualizer bars={8} height={30} />
                </div>

                <Card variant="elevated" padding="default" staggerChildren>
                    {/* Header */}
                    <div className="text-center mb-6 animate-item">
                        <h1
                            className={`
                text-2xl sm:text-3xl font-black uppercase tracking-tight mb-1
                ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
              `}
                        >
                            Welcome Back
                        </h1>
                        <p
                            className={`
                text-xs font-medium uppercase tracking-wider
                ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
              `}
                        >
                            Sign in to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="animate-item">
                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                error={errors.email}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="animate-item">
                            <PasswordInput
                                label="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                error={errors.password}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end animate-item">
                            <Link
                                to="/forgot-password"
                                className={`
                  text-[10px] font-bold uppercase tracking-wider
                  transition-all duration-200
                  border-b-2 border-transparent
                  ${isDark
                                        ? 'text-zinc-400 hover:text-zinc-50 hover:border-zinc-50'
                                        : 'text-zinc-600 hover:text-zinc-900 hover:border-zinc-900'
                                    }
                `}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <div className="animate-item">
                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                loading={isLoading}
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6 animate-item">
                        <div className="absolute inset-0 flex items-center">
                            <div
                                className={`
                  w-full border-t-2
                  ${isDark ? 'border-zinc-700' : 'border-zinc-300'}
                `}
                            />
                        </div>
                        <div className="relative flex justify-center">
                            <span
                                className={`
                  px-3 text-[10px] font-bold uppercase tracking-wider
                  ${isDark ? 'bg-zinc-900 text-zinc-500' : 'bg-white text-zinc-400'}
                `}
                            >
                                New Here?
                            </span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="animate-item">
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate('/signup')}
                        >
                            Create Account
                        </Button>
                    </div>
                </Card>

                {/* Contact Link */}
                <div className="text-center mt-4 animate-item">
                    <Link
                        to="/contact"
                        className={`
              text-[10px] font-bold uppercase tracking-wider
              transition-all duration-200
              ${isDark
                                ? 'text-zinc-500 hover:text-zinc-300'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }
            `}
                    >
                        Need Help? Contact Us
                    </Link>
                </div>
            </div>
        </Layout>
    );
});

export default LoginPage;