import { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Layout, Card, Input, PasswordInput, Button, Logo, MusicVisualizer } from '../components';
import gsap from 'gsap';

const SignUpPage = memo(function SignUpPage() {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const formFieldsRef = useRef([]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // GSAP entrance animation
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Main elements animation
            const elements = containerRef.current.querySelectorAll('.animate-item');

            gsap.fromTo(
                elements,
                { opacity: 0, y: 30, scale: 0.97 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: 'power3.out',
                }
            );

            // Form fields with slight delay
            gsap.fromTo(
                formFieldsRef.current,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: 'power2.out',
                    delay: 0.3,
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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

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
            // Shake animation on error
            gsap.fromTo(
                containerRef.current.querySelector('form'),
                { x: -10 },
                { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
            );
            return;
        }

        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);

        // Exit animation before navigation
        gsap.to(containerRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            onComplete: () => {
                navigate('/verify-email', {
                    state: {
                        email: formData.email,
                        type: 'signup'
                    }
                });
            }
        });
    }, [validateForm, navigate, formData.email]);

    return (
        <Layout showLogo={false} maxWidth="sm">
            <div ref={containerRef}>
                {/* Logo */}
                <div className="flex justify-center mb-4 animate-item">
                    <Logo size="default" />
                </div>

                {/* Visualizer */}
                <div className="flex justify-center mb-4 animate-item">
                    <MusicVisualizer bars={6} height={25} />
                </div>

                <Card variant="elevated" padding="default">
                    {/* Header */}
                    <div className="text-center mb-5 animate-item">
                        <h1
                            className={`
                text-2xl sm:text-3xl font-black uppercase tracking-tight mb-1
                ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
              `}
                        >
                            Join The Team
                        </h1>
                        <p
                            className={`
                text-xs font-medium uppercase tracking-wider
                ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
              `}
                        >
                            Create your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Name Fields */}
                        <div
                            ref={el => formFieldsRef.current[0] = el}
                            className="grid grid-cols-2 gap-3"
                        >
                            <Input
                                label="First Name"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                error={errors.firstName}
                                required
                                autoComplete="given-name"
                            />

                            <Input
                                label="Last Name"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                error={errors.lastName}
                                required
                                autoComplete="family-name"
                            />
                        </div>

                        <div ref={el => formFieldsRef.current[1] = el}>
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

                        <div ref={el => formFieldsRef.current[2] = el}>
                            <PasswordInput
                                label="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                error={errors.password}
                                showValidation={true}
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <div ref={el => formFieldsRef.current[3] = el}>
                            <PasswordInput
                                label="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                error={errors.confirmPassword}
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        {/* Submit Button */}
                        <div ref={el => formFieldsRef.current[4] = el} className="pt-2">
                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                loading={isLoading}
                                disabled={!isPasswordValid && formData.password.length > 0}
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-5 animate-item">
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
                                Already a Member?
                            </span>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <div className="animate-item">
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate('/login')}
                        >
                            Sign In Instead
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

export default SignUpPage;