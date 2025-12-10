import { memo } from 'react';
import { useTheme } from '../../context/ThemeContext';

const GlitchText = memo(function GlitchText({
    children,
    className = '',
    as: Component = 'span',
    intensity = 'medium',
}) {
    const { isDark } = useTheme();

    const intensities = {
        low: { offset: '1px', duration: '3s' },
        medium: { offset: '2px', duration: '2s' },
        high: { offset: '3px', duration: '1s' },
    };

    const current = intensities[intensity] || intensities.medium;

    return (
        <>
            <Component
                className={`relative inline-block ${className}`}
                data-text={children}
            >
                <span className="glitch-text">{children}</span>
            </Component>

            <style>{`
        .glitch-text {
          position: relative;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-text::before {
          animation: glitch-1 ${current.duration} infinite linear alternate-reverse;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translateX(-${current.offset});
          opacity: 0.8;
        }
        
        .glitch-text::after {
          animation: glitch-2 ${current.duration} infinite linear alternate-reverse;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          transform: translateX(${current.offset});
          opacity: 0.8;
        }
        
        @keyframes glitch-1 {
          0% { transform: translateX(-${current.offset}); }
          20% { transform: translateX(${current.offset}); }
          40% { transform: translateX(-${current.offset}); }
          60% { transform: translateX(${current.offset}); }
          80% { transform: translateX(-${current.offset}); }
          100% { transform: translateX(0); }
        }
        
        @keyframes glitch-2 {
          0% { transform: translateX(${current.offset}); }
          20% { transform: translateX(-${current.offset}); }
          40% { transform: translateX(${current.offset}); }
          60% { transform: translateX(-${current.offset}); }
          80% { transform: translateX(${current.offset}); }
          100% { transform: translateX(0); }
        }
      `}</style>
        </>
    );
});

export default GlitchText;