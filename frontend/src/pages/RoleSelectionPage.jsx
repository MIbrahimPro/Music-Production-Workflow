import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Layout, Card, Button, Logo, MusicVisualizer } from '../components';
import gsap from 'gsap';

const roles = [
    {
        id: 'admin',
        name: 'Administration',
        description: 'Manage users, permissions & settings',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        id: 'production',
        name: 'Production',
        description: 'Music production & recording',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
        ),
    },
    {
        id: 'audio-engineering',
        name: 'Audio Engineering',
        description: 'Mix, master & engineer tracks',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 6v6m0-6a2 2 0 100 4m0-4a2 2 0 110 4m5-14V2m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 6v6m0-6a2 2 0 100 4m0-4a2 2 0 110 4m5-14V2m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 6v6m0-6a2 2 0 100 4m0-4a2 2 0 110 4" />
            </svg>
        ),
    },
    {
        id: 'creative-design',
        name: 'Creative Design',
        description: 'Album artwork & visual content',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        id: 'video-production',
        name: 'Video Production',
        description: 'Music videos & visual stories',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        id: 'channel-management',
        name: 'Channel Management',
        description: 'YouTube & streaming platforms',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        id: 'distribution',
        name: 'Distribution',
        description: 'Release & distribution management',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        id: 'marketing',
        name: 'Marketing',
        description: 'Campaigns & promotion strategies',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
        ),
    },
];

const RoleSelectionPage = memo(function RoleSelectionPage() {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    const [selectedRole, setSelectedRole] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // GSAP entrance animation
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Header elements
            const elements = containerRef.current.querySelectorAll('.animate-item');

            gsap.fromTo(
                elements,
                { opacity: 0, y: 25 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: 'power3.out',
                }
            );

            // Role cards with wave effect
            gsap.fromTo(
                cardsRef.current,
                { opacity: 0, y: 40, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    stagger: {
                        each: 0.06,
                        from: 'start',
                        grid: [2, 4],
                    },
                    ease: 'back.out(1.4)',
                    delay: 0.3,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleRoleSelect = useCallback((roleId, index) => {
        setSelectedRole(roleId);

        // Pulse animation on selection
        if (cardsRef.current[index]) {
            gsap.fromTo(
                cardsRef.current[index],
                { scale: 0.95 },
                { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        }
    }, []);

    const handleContinue = useCallback(async () => {
        if (!selectedRole) return;

        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Exit animation
        gsap.to(containerRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            onComplete: () => {
                alert(`Selected role: ${roles.find(r => r.id === selectedRole)?.name}`);
                setIsLoading(false);
            }
        });
    }, [selectedRole]);

    return (
        <Layout showLogo={false} maxWidth="2xl">
            <div ref={containerRef}>
                {/* Logo */}
                <div className="flex justify-center mb-4 animate-item">
                    <Logo size="default" />
                </div>

                {/* Visualizer */}
                <div className="flex justify-center mb-4 animate-item">
                    <MusicVisualizer bars={10} height={30} />
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                    <h1
                        className={`
              text-2xl sm:text-3xl font-black uppercase tracking-tight mb-1 animate-item
              ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
            `}
                    >
                        Select Your Department
                    </h1>
                    <p
                        className={`
              text-xs font-medium tracking-wide animate-item
              ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
            `}
                    >
                        Choose the department you'll be working with
                    </p>
                </div>

                {/* Role Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                    {roles.map((role, index) => {
                        const isSelected = selectedRole === role.id;

                        return (
                            <button
                                key={role.id}
                                ref={el => cardsRef.current[index] = el}
                                onClick={() => handleRoleSelect(role.id, index)}
                                onMouseEnter={() => {
                                    if (cardsRef.current[index] && !isSelected) {
                                        gsap.to(cardsRef.current[index], {
                                            x: -2,
                                            y: -2,
                                            duration: 0.2,
                                            ease: 'power2.out',
                                        });
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (cardsRef.current[index] && !isSelected) {
                                        gsap.to(cardsRef.current[index], {
                                            x: 0,
                                            y: 0,
                                            duration: 0.2,
                                            ease: 'power2.out',
                                        });
                                    }
                                }}
                                className={`
                  relative p-4 text-left transition-colors duration-200
                  border-[2px] focus:outline-none
                  ${isSelected
                                        ? isDark
                                            ? 'bg-zinc-50 border-zinc-50 text-zinc-900 shadow-[4px_4px_0px_0px_rgba(250,250,250,0.3)]'
                                            : 'bg-zinc-900 border-zinc-900 text-zinc-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]'
                                        : isDark
                                            ? 'bg-zinc-900 border-zinc-700 text-zinc-50 hover:border-zinc-50 shadow-[3px_3px_0px_0px_rgba(250,250,250,0.1)]'
                                            : 'bg-white border-zinc-300 text-zinc-900 hover:border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]'
                                    }
                `}
                            >
                                {/* Selection indicator */}
                                {isSelected && (
                                    <div
                                        className={`
                      absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center
                      ${isDark ? 'bg-zinc-900 text-zinc-50' : 'bg-zinc-50 text-zinc-900'}
                    `}
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}

                                {/* Icon */}
                                <div
                                    className={`
                    w-10 h-10 mb-2 flex items-center justify-center
                    border-2 transition-colors duration-200
                    ${isSelected
                                            ? isDark
                                                ? 'bg-zinc-900 border-zinc-900 text-zinc-50'
                                                : 'bg-zinc-50 border-zinc-50 text-zinc-900'
                                            : isDark
                                                ? 'bg-zinc-800 border-zinc-600'
                                                : 'bg-zinc-100 border-zinc-300'
                                        }
                  `}
                                >
                                    {role.icon}
                                </div>

                                {/* Content */}
                                <h3
                                    className={`
                    text-xs font-bold uppercase tracking-wider mb-0.5
                    ${isSelected
                                            ? isDark ? 'text-zinc-900' : 'text-zinc-50'
                                            : ''
                                        }
                  `}
                                >
                                    {role.name}
                                </h3>
                                <p
                                    className={`
                    text-[10px] leading-relaxed
                    ${isSelected
                                            ? isDark ? 'text-zinc-600' : 'text-zinc-400'
                                            : isDark ? 'text-zinc-500' : 'text-zinc-500'
                                        }
                  `}
                                >
                                    {role.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Continue Button */}
                <div className="flex justify-center animate-item">
                    <Button
                        size="large"
                        onClick={handleContinue}
                        disabled={!selectedRole}
                        loading={isLoading}
                        className="min-w-[180px]"
                    >
                        Continue
                    </Button>
                </div>

                {/* Skip option */}
                <div className="text-center mt-4 animate-item">
                    <button
                        onClick={() => navigate('/login')}
                        className={`
              text-xs font-bold uppercase tracking-wider
              transition-all duration-200
              ${isDark
                                ? 'text-zinc-500 hover:text-zinc-300'
                                : 'text-zinc-500 hover:text-zinc-700'
                            }
            `}
                    >
                        I'll do this later
                    </button>
                </div>
            </div>
        </Layout>
    );
});

export default RoleSelectionPage;