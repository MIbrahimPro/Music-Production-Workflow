import { memo, forwardRef, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import gsap from 'gsap';

const Card = memo(forwardRef(function Card({
    children,
    variant = 'elevated',
    padding = 'default',
    className = '',
    animate = false,
    staggerChildren = false,
    ...props
}, ref) {
    const { isDark } = useTheme();
    const cardRef = useRef(null);
    const combinedRef = ref || cardRef;

    useEffect(() => {
        if (!combinedRef.current) return;

        // Entrance animation
        gsap.fromTo(
            combinedRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );

        // Stagger children if enabled
        if (staggerChildren) {
            const children = combinedRef.current.querySelectorAll('.animate-item');
            if (children.length > 0) {
                gsap.fromTo(
                    children,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.2, ease: 'power2.out' }
                );
            }
        }
    }, [combinedRef, staggerChildren]);

    const paddings = {
        none: '',
        small: 'p-3',
        default: 'p-4 sm:p-6',
        large: 'p-6 sm:p-8',
    };

    const variants = {
        elevated: isDark
            ? `bg-zinc-900 border-zinc-50 shadow-[6px_6px_0px_0px_rgba(250,250,250,0.15)]`
            : `bg-white border-zinc-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]`,
        flat: isDark
            ? `bg-zinc-900 border-zinc-700`
            : `bg-white border-zinc-300`,
        ghost: isDark
            ? `bg-transparent border-zinc-700`
            : `bg-transparent border-zinc-300`,
    };

    return (
        <div
            ref={combinedRef}
            className={`
        border-[2px] transition-all duration-300
        ${paddings[padding]}
        ${variants[variant]}
        ${animate ? 'hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0px_0px_rgba(0,0,0,0.2)]' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}));

export default Card;