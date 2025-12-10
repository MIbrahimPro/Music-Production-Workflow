import { memo, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import gsap from 'gsap';

const Logo = memo(function Logo({ size = 'default', showText = true }) {
    const { isDark } = useTheme();
    const logoRef = useRef(null);
    const barsRef = useRef([]);

    const sizes = {
        small: { icon: 26, text: 'text-sm', barWidth: 3 },
        default: { icon: 36, text: 'text-lg', barWidth: 3 },
        large: { icon: 48, text: 'text-2xl', barWidth: 4 },
    };

    const currentSize = sizes[size] || sizes.default;

    useEffect(() => {
        if (barsRef.current.length === 0) return;

        const ctx = gsap.context(() => {
            barsRef.current.forEach((bar, i) => {
                if (!bar) return;
                gsap.to(bar, {
                    scaleY: gsap.utils.random(0.3, 1),
                    duration: gsap.utils.random(0.4, 0.8),
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    delay: i * 0.1,
                });
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={logoRef} className="flex items-center gap-2 select-none">
            {/* Brutalist Music Icon */}
            <div
                className={`
          relative flex items-end justify-center gap-[2px]
          ${isDark ? 'bg-zinc-50' : 'bg-zinc-900'}
          p-1.5 transition-colors duration-300
        `}
                style={{
                    width: currentSize.icon,
                    height: currentSize.icon,
                }}
            >
                {[0.6, 1, 0.75, 0.9, 0.5].map((height, i) => (
                    <div
                        key={i}
                        ref={el => barsRef.current[i] = el}
                        className={`
              ${isDark ? 'bg-zinc-900' : 'bg-zinc-50'}
              transition-colors duration-300 origin-bottom
            `}
                        style={{
                            width: `${currentSize.barWidth}px`,
                            height: `${height * 100}%`,
                        }}
                    />
                ))}
            </div>

            {showText && (
                <div className="flex flex-col leading-none">
                    <span
                        className={`
              ${currentSize.text} font-black tracking-tighter uppercase
              ${isDark ? 'text-zinc-50' : 'text-zinc-900'}
              transition-colors duration-300
            `}
                    >
                        MUSIC
                    </span>
                    <span
                        className={`
              ${currentSize.text} font-black tracking-tighter uppercase
              ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
              transition-colors duration-300
            `}
                    >
                        TASKBOARD
                    </span>
                </div>
            )}
        </div>
    );
});

export default Logo;