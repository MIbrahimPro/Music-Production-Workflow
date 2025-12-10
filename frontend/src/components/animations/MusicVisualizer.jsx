import { memo, useMemo, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import gsap from 'gsap';

const MusicVisualizer = memo(function MusicVisualizer({
    bars = 12,
    height = 50,
    className = '',
    variant = 'default',
}) {
    const { isDark } = useTheme();
    const barsRef = useRef([]);

    const barData = useMemo(() =>
        Array.from({ length: bars }, (_, i) => ({
            delay: i * 0.08,
            duration: 0.4 + Math.random() * 0.4,
            initialHeight: 20 + Math.random() * 40,
        }))
        , [bars]);

    useEffect(() => {
        if (barsRef.current.length === 0) return;

        const ctx = gsap.context(() => {
            barsRef.current.forEach((bar, i) => {
                if (!bar) return;

                gsap.to(bar, {
                    scaleY: gsap.utils.random(0.2, 1),
                    duration: barData[i].duration,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    delay: barData[i].delay,
                });
            });
        });

        return () => ctx.revert();
    }, [barData]);

    const variants = {
        default: {
            barClass: isDark ? 'bg-zinc-50' : 'bg-zinc-900',
            gap: 'gap-0.5',
        },
        gradient: {
            barClass: 'bg-gradient-to-t from-zinc-500 to-zinc-900 dark:from-zinc-400 dark:to-zinc-50',
            gap: 'gap-0.5',
        },
        minimal: {
            barClass: isDark ? 'bg-zinc-600' : 'bg-zinc-400',
            gap: 'gap-px',
        },
    };

    const currentVariant = variants[variant] || variants.default;

    return (
        <div
            className={`flex items-end justify-center ${currentVariant.gap} ${className}`}
            style={{ height }}
            aria-hidden="true"
        >
            {barData.map((bar, index) => (
                <div
                    key={index}
                    ref={el => barsRef.current[index] = el}
                    className={`w-1 rounded-sm ${currentVariant.barClass} transition-colors duration-300 origin-bottom`}
                    style={{
                        height: `${bar.initialHeight}%`,
                    }}
                />
            ))}
        </div>
    );
});

export default MusicVisualizer;