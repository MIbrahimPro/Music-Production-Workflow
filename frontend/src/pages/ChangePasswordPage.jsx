import { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Layout, Card, PasswordInput, Button, Logo, MusicVisualizer } from '../components';
import gsap from 'gsap';

const ChangePasswordPage = memo(function ChangePasswordPage() {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const iconRef = useRef(null);
    const successRef = useRef(null);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
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

            if (iconRef.current) {
                gsap.fromTo(
                    iconRef.current,
                    { scale: 0, rotate: 180 },
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
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
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
        const p = formData.newPassword;
        return (
            p.length >= 8 &&
            /[A-Z]/.test(p) &&
            /[a-z]/.test(p) &&
            /\d/.test(p) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(p)
        );
    }, [formData.newPassword]);

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (!isPasswordValid) {
            newErrors.newPassword = 'Password does not meet requirements';
        } else if (formData.newPassword === formData.currentPassword) {
            newErrors.newPassword = 'New password must be different';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
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
            navigate(-1);
        }, 2500);
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
                    <MusicVisualizer bars={6} height={25} />
                </div>

                <Card variant="elevated" padding="default">
                    {!isSuccess ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-5">
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
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    </svg>
                                </div>
                                <h1
                                    className={`
                    text-xl sm:text-2xl font-black uppercase tracking-tight mb-1 animate-item
                    ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
                  `}
                                >
                                    Change Password
                                </h1>
                                <p
                                    className={`
                    text-xs font-medium tracking-wide animate-item
                    ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                  `}
                                >
                                    Update your account password
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="animate-item">
                                    <PasswordInput
                                        label="Current Password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        placeholder="Enter current password"
                                        error={errors.currentPassword}
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>

                                <div
                                    className={`
                    border-t-2 my-4 animate-item
                    ${isDark ? 'border-zinc-700' : 'border-zinc-200'}
                  `}
                                />

                                <div className="animate-item">
                                    <PasswordInput
                                        label="New Password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        error={errors.newPassword}
                                        showValidation={true}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="animate-item">
                                    <PasswordInput
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        error={errors.confirmPassword}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="flex gap-3 pt-3 animate-item">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        fullWidth
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        loading={isLoading}
                                        disabled={!isPasswordValid && formData.newPassword.length > 0}
                                    >
                                        Update
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
                                Password Updated!
                            </h2>
                            <p
                                className={`
                  text-xs font-medium
                  ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                `}
                            >
                                Your password has been changed successfully.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
});

export default ChangePasswordPage;