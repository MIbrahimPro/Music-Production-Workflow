import { memo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Layout, Card, Button, Logo } from '../components';
import gsap from 'gsap';

const DeactivatedPage = memo(function DeactivatedPage() {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const iconRef = useRef(null);
    const reasonsRef = useRef([]);

    // GSAP entrance animation
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const elements = containerRef.current.querySelectorAll('.animate-item');

            gsap.fromTo(
                elements,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power3.out',
                }
            );

            // Icon with shake effect
            if (iconRef.current) {
                gsap.fromTo(
                    iconRef.current,
                    { scale: 0 },
                    {
                        scale: 1,
                        duration: 0.5,
                        ease: 'back.out(1.7)',
                        delay: 0.2,
                    }
                );

                // Subtle shake
                gsap.to(iconRef.current, {
                    x: 2,
                    duration: 0.1,
                    repeat: 5,
                    yoyo: true,
                    ease: 'power1.inOut',
                    delay: 0.7,
                });
            }

            // Reasons list
            gsap.fromTo(
                reasonsRef.current,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    stagger: 0.08,
                    ease: 'power2.out',
                    delay: 0.5,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const reasons = [
        'You are not a verified Employee for the organization',
        // 'You',
        // 'Extended period of inactivity',
        'Administrative decision',
        'Account under review',
    ];

    return (
        <Layout showLogo={false} maxWidth="md">
            <div ref={containerRef}>
                {/* Logo */}
                <div className="flex justify-center mb-5 animate-item">
                    <Logo size="large" />
                </div>

                <Card variant="elevated" padding="default">
                    <div className="text-center">
                        {/* Icon */}
                        <div
                            ref={iconRef}
                            className={`
                w-18 h-18 mx-auto mb-4 flex items-center justify-center
                border-[2px] transition-colors duration-300
                ${isDark
                                    ? 'bg-red-900/20 border-red-500'
                                    : 'bg-red-50 border-red-500'
                                }
              `}
                            style={{ width: '72px', height: '72px' }}
                        >
                            <svg
                                className="w-9 h-9 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                />
                            </svg>
                        </div>

                        {/* Title */}
                        <h1
                            className={`
                text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2 animate-item
                ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
              `}
                        >
                            Account Suspended
                        </h1>

                        {/* Description */}
                        <div
                            className={`
                max-w-sm mx-auto space-y-2 mb-5 animate-item
                ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
              `}
                        >
                            <p className="text-sm font-medium">
                                Your account has been temporarily suspended or deactivated.
                            </p>
                            <p className="text-xs">
                                Please contact our support team for more information.
                            </p>
                        </div>

                        {/* Status Box */}
                        <div
                            className={`
                inline-flex items-center gap-2.5 px-4 py-3 mb-5 animate-item
                border-[2px] 
                ${isDark
                                    ? 'bg-red-900/10 border-red-900/50'
                                    : 'bg-red-50 border-red-200'
                                }
              `}
                        >
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                            <span
                                className={`
                  text-xs font-bold uppercase tracking-wider
                  ${isDark ? 'text-red-400' : 'text-red-600'}
                `}
                            >
                                Status: Account Suspended
                            </span>
                        </div>

                        {/* Possible Reasons */}
                        <div
                            className={`
                text-left max-w-sm mx-auto p-4 mb-5
                border-[2px]
                ${isDark
                                    ? 'bg-zinc-800/50 border-zinc-700'
                                    : 'bg-zinc-50 border-zinc-300'
                                }
              `}
                        >
                            <h3
                                className={`
                  text-[10px] font-black uppercase tracking-wider mb-3
                  ${isDark ? 'text-zinc-300' : 'text-zinc-700'}
                `}
                            >
                                Possible Reasons
                            </h3>
                            <ul className="space-y-1.5">
                                {reasons.map((item, index) => (
                                    <li
                                        key={index}
                                        ref={el => reasonsRef.current[index] = el}
                                        className={`
                      flex items-center gap-2.5 text-xs
                      ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                    `}
                                    >
                                        <svg
                                            className="w-3.5 h-3.5 flex-shrink-0 text-red-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Appeal Note */}
                        <div
                            className={`
                max-w-sm mx-auto p-3 mb-5 animate-item
                border-l-4 border-amber-500
                ${isDark ? 'bg-amber-900/10' : 'bg-amber-50'}
              `}
                        >
                            <p
                                className={`
                  text-xs
                  ${isDark ? 'text-amber-300' : 'text-amber-700'}
                `}
                            >
                                <strong>Note:</strong> If you believe this is a mistake,
                                please contact support to appeal.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-item">
                            <Button
                                variant="primary"
                                size="default"
                                onClick={() => navigate('/contact')}
                            >
                                Contact Support
                            </Button>
                            <Button
                                variant="secondary"
                                size="default"
                                onClick={() => navigate('/login')}
                            >
                                Back to Login
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </Layout>
    );
});

export default DeactivatedPage;