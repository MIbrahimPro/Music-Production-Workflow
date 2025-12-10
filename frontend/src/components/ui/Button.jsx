import { memo, forwardRef, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import gsap from 'gsap';

const Button = memo(forwardRef(function Button({
    children,
    variant = 'primary',
    size = 'default',
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}, ref) {
    const { isDark } = useTheme();
    const buttonRef = useRef(null);
    const combinedRef = ref || buttonRef;

    useEffect(() => {
        if (!combinedRef.current) return;

        const button = combinedRef.current;

        const handleMouseEnter = () => {
            if (disabled || loading) return;
            gsap.to(button, {
                x: -2,
                y: -2,
                duration: 0.15,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.15,
                ease: 'power2.out',
            });
        };

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            button.removeEventListener('mouseenter', handleMouseEnter);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [combinedRef, disabled, loading]);

    const baseStyles = `
    relative font-bold uppercase tracking-wider
    border-[2px] transition-colors duration-200
    active:translate-x-[3px] active:translate-y-[3px]
    active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed
    disabled:transform-none disabled:shadow-none
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    ${fullWidth ? 'w-full' : ''}
  `;

    const sizes = {
        small: 'px-3 py-1.5 text-[10px]',
        default: 'px-4 py-2 text-xs',
        large: 'px-6 py-2.5 text-xs',
    };

    const variants = {
        primary: isDark
            ? `bg-zinc-50 text-zinc-900 border-zinc-50 
         shadow-[3px_3px_0px_0px_rgba(250,250,250,0.3)]
         hover:bg-zinc-200
         focus-visible:ring-zinc-50`
            : `bg-zinc-900 text-zinc-50 border-zinc-900 
         shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]
         hover:bg-zinc-800
         focus-visible:ring-zinc-900`,
        secondary: isDark
            ? `bg-transparent text-zinc-50 border-zinc-50 
         shadow-[3px_3px_0px_0px_rgba(250,250,250,0.2)]
         hover:bg-zinc-50 hover:text-zinc-900
         focus-visible:ring-zinc-50`
            : `bg-transparent text-zinc-900 border-zinc-900 
         shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]
         hover:bg-zinc-900 hover:text-zinc-50
         focus-visible:ring-zinc-900`,
        ghost: isDark
            ? `bg-transparent text-zinc-50 border-transparent 
         hover:border-zinc-50 hover:bg-zinc-800`
            : `bg-transparent text-zinc-900 border-transparent 
         hover:border-zinc-900 hover:bg-zinc-100`,
    };

    return (
        <button
            ref={combinedRef}
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
        ${baseStyles}
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg
                        className="animate-spin h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    Loading...
                </span>
            ) : children}
        </button>
    );
}));

export default Button;