import { memo, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Logo from '../ui/Logo';
import MusicVisualizer from '../animations/MusicVisualizer';
import gsap from 'gsap';

const Layout = memo(function Layout({
    children,
    showLogo = true,
    showVisualizer = true,
    centered = true,
    maxWidth = 'md',
}) {
    const { isDark } = useTheme();
    const contentRef = useRef(null);

    useEffect(() => {
        if (!contentRef.current) return;

        gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    const maxWidths = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-full',
    };

    return (
        <div
            className={`
        min-h-screen w-full transition-colors duration-300
        ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}
      `}
        >
            {/* Background Pattern */}
            <div
                className={`
          fixed inset-0 pointer-events-none opacity-[0.015]
          ${isDark ? 'bg-white' : 'bg-black'}
        `}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isDark ? 'ffffff' : '000000'}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Header - Fixed centering */}
            <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between h-8">
                    {showLogo ? <Logo size="small" /> : <div className="w-1" />}
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main
                ref={contentRef}
                className={`
          relative z-10 w-full px-4 sm:px-5 py-16 sm:py-20
          ${centered ? 'flex flex-col items-center justify-center min-h-screen' : ''}
        `}
            >
                <div className={`w-full ${maxWidths[maxWidth]}`}>
                    {children}
                </div>
            </main>

            {/* Decorative Visualizer */}
            {showVisualizer && (
                <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-15">
                    <MusicVisualizer
                        bars={20}
                        height={50}
                        variant="minimal"
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
});

export default Layout;