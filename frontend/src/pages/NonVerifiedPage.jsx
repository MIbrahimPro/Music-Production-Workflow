import { memo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Layout, Card, Button, Logo, MusicVisualizer } from '../components';
import gsap from 'gsap';

const NonVerifiedPage = memo(function NonVerifiedPage() {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const iconRef = useRef(null);
    const stepsRef = useRef([]);
    const statusRef = useRef(null);

    // GSAP entrance animation
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Main elements
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

            // Icon animation with bounce
            if (iconRef.current) {
                gsap.fromTo(
                    iconRef.current,
                    { scale: 0, rotate: -180 },
                    {
                        scale: 1,
                        rotate: 0,
                        duration: 0.7,
                        ease: 'back.out(1.7)',
                        delay: 0.2,
                    }
                );

                // Continuous subtle pulse
                gsap.to(iconRef.current, {
                    scale: 1.05,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    delay: 0.9,
                });
            }

            // Steps stagger animation
            gsap.fromTo(
                stepsRef.current,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'power2.out',
                    delay: 0.5,
                }
            );

            // Status box animation
            if (statusRef.current) {
                gsap.fromTo(
                    statusRef.current,
                    { opacity: 0, scale: 0.9 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        ease: 'back.out(1.4)',
                        delay: 0.4,
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const steps = [
        'Our team will review your account details',
        'You will receive an email once verified',
        'After verification, you can select your department',
        'Start collaborating with your team!',
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
                                    ? 'bg-amber-900/20 border-amber-500'
                                    : 'bg-amber-50 border-amber-500'
                                }
              `}
                            style={{ width: '72px', height: '72px' }}
                        >
                            <svg
                                className="w-9 h-9 text-amber-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
                            Verification Pending
                        </h1>

                        {/* Description */}
                        <div
                            className={`
                max-w-sm mx-auto space-y-2 mb-5 animate-item
                ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
              `}
                        >
                            <p className="text-sm font-medium">
                                Your account has been created successfully, but it's not yet verified by our team.
                            </p>
                            <p className="text-xs">
                                Our administrators will review your account and verify it shortly.
                            </p>
                        </div>

                        {/* Status Box */}
                        <div
                            ref={statusRef}
                            className={`
                inline-flex items-center gap-2.5 px-4 py-3 mb-5
                border-[2px] 
                ${isDark
                                    ? 'bg-zinc-800 border-zinc-700'
                                    : 'bg-zinc-100 border-zinc-300'
                                }
              `}
                        >
                            <div className="relative">
                                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                                <div className="absolute inset-0 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping opacity-75"></div>
                            </div>
                            <span
                                className={`
                  text-xs font-bold uppercase tracking-wider
                  ${isDark ? 'text-zinc-300' : 'text-zinc-700'}
                `}
                            >
                                Awaiting Staff Verification
                            </span>
                        </div>

                        {/* Visualizer */}
                        <div className="mb-5 animate-item">
                            <MusicVisualizer bars={10} height={40} variant="minimal" />
                        </div>

                        {/* What to expect */}
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
                                What happens next?
                            </h3>
                            <ul className="space-y-2">
                                {steps.map((item, index) => (
                                    <li
                                        key={index}
                                        ref={el => stepsRef.current[index] = el}
                                        className={`
                      flex items-start gap-2.5 text-xs
                      ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                    `}
                                    >
                                        <span
                                            className={`
                        flex-shrink-0 w-5 h-5 flex items-center justify-center
                        text-[10px] font-bold
                        ${isDark
                                                    ? 'bg-zinc-700 text-zinc-300'
                                                    : 'bg-zinc-200 text-zinc-700'
                                                }
                      `}
                                        >
                                            {index + 1}
                                        </span>
                                        <span className="pt-0.5">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-item">
                            <Button
                                variant="secondary"
                                size="default"
                                onClick={() => navigate('/contact')}
                            >
                                Contact Support
                            </Button>
                            <Button
                                variant="primary"
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

export default NonVerifiedPage;