import { memo, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import gsap from 'gsap';

const ThemeToggle = memo(function ThemeToggle({ className = '' }) {
    const { isDark, toggleTheme } = useTheme();
    const toggleRef = useRef(null);
    const knobRef = useRef(null);

    useEffect(() => {
        if (!knobRef.current) return;

        gsap.to(knobRef.current, {
            x: isDark ? 22 : 0,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, [isDark]);

    const handleClick = () => {
        // Add a small bounce animation on click
        gsap.fromTo(
            toggleRef.current,
            { scale: 0.95 },
            { scale: 1, duration: 0.2, ease: 'back.out(1.7)' }
        );
        toggleTheme();
    };

    return (
        <button
            ref={toggleRef}
            onClick={handleClick}
            className={`
        relative w-12 h-6 rounded-none border-[2px] 
        transition-colors duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        flex items-center
        ${isDark
                    ? 'bg-zinc-800 border-zinc-50 focus-visible:ring-zinc-50'
                    : 'bg-zinc-200 border-zinc-900 focus-visible:ring-zinc-900'
                }
        ${className}
      `}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <span
                ref={knobRef}
                className={`
          absolute left-0.5 w-4 h-4 flex items-center justify-center
          transition-colors duration-300
          ${isDark
                        ? 'bg-zinc-50'
                        : 'bg-zinc-900'
                    }
        `}
            >
                {isDark ? (
                    <svg className="w-2.5 h-2.5 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-2.5 h-2.5 text-zinc-50" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
            </span>
        </button>
    );
});

export default ThemeToggle;