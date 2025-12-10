import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Layout, Card, Input, Button, Logo, MusicVisualizer } from '../components';
import gsap from 'gsap';

const ContactPage = memo(function ContactPage() {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const cardsRef = useRef([]);
    const formRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const contactInfo = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            label: 'Location',
            value: '123 Music Street, Sound City, SC 12345',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            label: 'Email',
            value: 'support@musictaskboard.com',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            label: 'Phone',
            value: '+1 (555) 123-4567',
        },
    ];

    // GSAP Animations
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Animate contact cards
            gsap.fromTo(
                cardsRef.current,
                { opacity: 0, y: 30, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'back.out(1.4)',
                    delay: 0.2,
                }
            );

            // Animate form
            if (formRef.current) {
                gsap.fromTo(
                    formRef.current,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power3.out',
                        delay: 0.5,
                    }
                );
            }
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

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 20) {
            newErrors.message = 'Message must be at least 20 characters';
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
        setIsSubmitted(true);
    }, [validateForm]);

    return (
        <Layout showLogo={false} maxWidth="xl">
            <div ref={containerRef}>
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Logo size="default" />
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1
                        className={`
              text-3xl sm:text-4xl font-black uppercase tracking-tight mb-2
              ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
            `}
                    >
                        Get In Touch
                    </h1>
                    <p
                        className={`
              text-sm font-medium uppercase tracking-wider
              ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
            `}
                    >
                        We'd love to hear from you
                    </p>
                </div>


                {/* Contact Info Cards - Horizontal on top */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {contactInfo.map((info, index) => (
                        <div
                            key={index}
                            ref={el => cardsRef.current[index] = el}
                            className={`
                p-4 border-[2px] transition-all duration-200
                hover:translate-x-[-2px] hover:translate-y-[-2px]
                ${isDark
                                    ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-50 hover:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.1)]'
                                    : 'bg-white border-zinc-300 hover:border-zinc-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
                                }
              `}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`
                    flex-shrink-0 w-10 h-10 flex items-center justify-center
                    border-[2px] transition-colors duration-300
                    ${isDark
                                            ? 'bg-zinc-800 border-zinc-600 text-zinc-50'
                                            : 'bg-zinc-100 border-zinc-300 text-zinc-900'
                                        }
                  `}
                                >
                                    {info.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3
                                        className={`
                      text-[10px] font-bold uppercase tracking-wider mb-0.5
                      ${isDark ? 'text-zinc-500' : 'text-zinc-500'}
                    `}
                                    >
                                        {info.label}
                                    </h3>
                                    <p
                                        className={`
                      text-xs font-medium truncate
                      ${isDark ? 'text-zinc-300' : 'text-zinc-700'}
                    `}
                                        title={info.value}
                                    >
                                        {info.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Form - Below cards */}
                <Card ref={formRef} variant="elevated" padding="default">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                    label="Your Name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    error={errors.name}
                                    required
                                    autoComplete="name"
                                />

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

                            <Input
                                label="Subject"
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="How can we help?"
                                error={errors.subject}
                                required
                            />

                            {/* Textarea */}
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="message"
                                    className={`
                    text-[10px] font-bold uppercase tracking-wider
                    ${isDark ? 'text-zinc-300' : 'text-zinc-700'}
                  `}
                                >
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us more about your inquiry..."
                                    rows={4}
                                    className={`
                    w-full px-3 py-2 text-sm font-medium resize-none
                    border-[2px] transition-all duration-200
                    focus:outline-none
                    ${isDark
                                            ? `bg-zinc-900 text-zinc-50 border-zinc-700 
                         placeholder-zinc-500
                         focus:border-zinc-50 focus:shadow-[3px_3px_0px_0px_rgba(250,250,250,0.2)]`
                                            : `bg-white text-zinc-900 border-zinc-300 
                         placeholder-zinc-400
                         focus:border-zinc-900 focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]`
                                        }
                    ${errors.message ? 'border-red-500' : ''}
                  `}
                                />
                                {errors.message && (
                                    <span className="text-red-500 text-[10px] font-medium flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    fullWidth
                                    loading={isLoading}
                                >
                                    Send Message
                                </Button>
                            </div>
                        </form>
                    ) : (
                        /* Success State */
                        <div className="text-center py-6">
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
                                Message Sent!
                            </h2>
                            <p
                                className={`
                  text-xs font-medium mb-4
                  ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                `}
                            >
                                Thank you for reaching out. We'll get back to you soon!
                            </p>
                            <Button size="small" onClick={() => navigate('/login')}>
                                Back to Login
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Visualizer decoration */}
                <div className="mt-6">
                    <MusicVisualizer bars={12} height={35} variant="minimal" />
                </div>
            </div>
        </Layout>
    );
});

export default ContactPage;