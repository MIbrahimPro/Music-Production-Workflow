import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Layout, Card, OTPInput, Button, Logo, MusicVisualizer } from '../components';
import gsap from 'gsap';

const OTPPage = memo(function OTPPage() {
    const { isDark } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const successRef = useRef(null);
    const iconRef = useRef(null);

    const { email = 'your@email.com', type = 'signup' } = location.state || {};

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

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

                // Floating animation
                gsap.to(iconRef.current, {
                    y: -5,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    delay: 0.7,
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Success animation
    useEffect(() => {
        if (isVerified && successRef.current) {
            gsap.fromTo(
                successRef.current,
                { opacity: 0, scale: 0.5, rotate: -10 },
                {
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                }
            );

            // Confetti-like particles
            const particles = successRef.current.querySelectorAll('.particle');
            gsap.fromTo(
                particles,
                { opacity: 0, scale: 0 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: 'back.out(2)',
                    delay: 0.3,
                }
            );
        }
    }, [isVerified]);

    // Resend timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleOTPChange = useCallback((value) => {
        setOtp(value);
        if (error) setError('');
    }, [error]);

    const handleVerify = useCallback(async (otpValue = otp) => {
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (otpValue === '111111') {
            setIsVerified(true);
            setError('');

            setTimeout(() => {
                if (type === 'signup') {
                    navigate('/non-verified');
                } else {
                    navigate('/reset-password', { state: { email } });
                }
            }, 2500);
        } else {
            setError('Invalid verification code. Please try again.');
            setOtp('');

            // Shake animation on error
            gsap.fromTo(
                containerRef.current.querySelector('.otp-container'),
                { x: -10 },
                { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }
            );
        }

        setIsLoading(false);
    }, [otp, type, navigate, email]);

    const handleComplete = useCallback((otpValue) => {
        handleVerify(otpValue);
    }, [handleVerify]);

    const handleResend = useCallback(async () => {
        if (!canResend) return;

        setCanResend(false);
        setResendTimer(60);
        setError('');
        setOtp('');

        // Button pulse animation
        gsap.fromTo(
            containerRef.current.querySelector('.resend-btn'),
            { scale: 0.95 },
            { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );

        await new Promise(resolve => setTimeout(resolve, 1000));
    }, [canResend]);

    const isSignup = type === 'signup';

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
                    {!isVerified ? (
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
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h1
                                    className={`
                    text-xl sm:text-2xl font-black uppercase tracking-tight mb-1 animate-item
                    ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
                  `}
                                >
                                    {isSignup ? 'Verify Email' : 'Enter Reset Code'}
                                </h1>
                                <p
                                    className={`
                    text-xs font-medium tracking-wide animate-item
                    ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                  `}
                                >
                                    We sent a 6-digit code to
                                </p>
                                <p
                                    className={`
                    text-xs font-bold mt-0.5 animate-item
                    ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
                  `}
                                >
                                    {email}
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div className="mb-5 otp-container animate-item">
                                <OTPInput
                                    length={6}
                                    value={otp}
                                    onChange={handleOTPChange}
                                    onComplete={handleComplete}
                                    error={error}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Verify Button */}
                            <div className="animate-item">
                                <Button
                                    onClick={() => handleVerify()}
                                    fullWidth
                                    size="large"
                                    loading={isLoading}
                                    disabled={otp.length !== 6}
                                >
                                    {isSignup ? 'Verify Email' : 'Verify Code'}
                                </Button>
                            </div>

                            {/* Resend Code */}
                            <div className="mt-5 text-center animate-item">
                                <p
                                    className={`
                    text-[10px]
                    ${isDark ? 'text-zinc-500' : 'text-zinc-500'}
                  `}
                                >
                                    Didn't receive the code?
                                </p>
                                {canResend ? (
                                    <button
                                        onClick={handleResend}
                                        className={`
                      resend-btn mt-1 text-xs font-bold uppercase tracking-wider
                      transition-all duration-200
                      border-b-2 border-transparent
                      ${isDark
                                                ? 'text-zinc-300 hover:text-zinc-50 hover:border-zinc-50'
                                                : 'text-zinc-700 hover:text-zinc-900 hover:border-zinc-900'
                                            }
                    `}
                                    >
                                        Resend Code
                                    </button>
                                ) : (
                                    <p
                                        className={`
                      mt-1 text-xs font-medium
                      ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                    `}
                                    >
                                        Resend in <span className="font-bold tabular-nums">{resendTimer}s</span>
                                    </p>
                                )}
                            </div>

                            {/* Hint for testing */}
                            <div
                                className={`
                  mt-5 p-2.5 text-center border-2 border-dashed animate-item
                  ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-zinc-300 text-zinc-500'}
                `}
                            >
                                <p className="text-[10px] font-medium uppercase tracking-wider">
                                    Demo: Use code <span className="font-bold">111111</span>
                                </p>
                            </div>
                        </>
                    ) : (
                        /* Success State */
                        <div ref={successRef} className="text-center py-6 relative">
                            {/* Decorative particles */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`particle absolute w-2 h-2 ${isDark ? 'bg-green-400' : 'bg-green-500'}`}
                                        style={{
                                            left: `${20 + i * 12}%`,
                                            top: `${10 + (i % 2) * 20}%`,
                                            transform: `rotate(${i * 45}deg)`,
                                        }}
                                    />
                                ))}
                            </div>

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
                                Verified!
                            </h2>
                            <p
                                className={`
                  text-xs font-medium
                  ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                `}
                            >
                                {isSignup
                                    ? 'Your email has been verified.'
                                    : 'Redirecting to reset password...'}
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
});

export default OTPPage;