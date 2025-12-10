import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

// Hook for staggered entrance animations
export function useStaggerAnimation(containerRef, selector = '.animate-item', options = {}) {
    const {
        delay = 0,
        stagger = 0.1,
        duration = 0.6,
        y = 30,
        opacity = 0,
        ease = 'power3.out',
        onComplete,
    } = options;

    useEffect(() => {
        if (!containerRef.current) return;

        const elements = containerRef.current.querySelectorAll(selector);
        if (elements.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                elements,
                {
                    opacity,
                    y,
                    scale: 0.98,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration,
                    stagger,
                    delay,
                    ease,
                    onComplete,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [containerRef, selector, delay, stagger, duration, y, opacity, ease, onComplete]);
}

// Hook for single element entrance animation
export function useEntranceAnimation(ref, options = {}) {
    const {
        delay = 0,
        duration = 0.5,
        y = 20,
        opacity = 0,
        scale = 0.98,
        ease = 'power3.out',
    } = options;

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ref.current,
                { opacity, y, scale },
                { opacity: 1, y: 0, scale: 1, duration, delay, ease }
            );
        }, ref);

        return () => ctx.revert();
    }, [ref, delay, duration, y, opacity, scale, ease]);
}

// Hook for hover animations
export function useHoverAnimation(ref, options = {}) {
    const {
        scale = 1.02,
        x = -2,
        y = -2,
        duration = 0.2,
        ease = 'power2.out',
    } = options;

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const handleMouseEnter = () => {
            gsap.to(element, { scale, x, y, duration, ease });
        };

        const handleMouseLeave = () => {
            gsap.to(element, { scale: 1, x: 0, y: 0, duration, ease });
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [ref, scale, x, y, duration, ease]);
}

// Utility function for manual animations
export function animateElement(element, options = {}) {
    const {
        from = { opacity: 0, y: 20 },
        to = { opacity: 1, y: 0 },
        duration = 0.5,
        delay = 0,
        ease = 'power3.out',
    } = options;

    return gsap.fromTo(element, from, { ...to, duration, delay, ease });
}

// Page transition animation
export function usePageTransition(ref) {
    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ref.current,
                {
                    opacity: 0,
                    y: 40,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                }
            );
        }, ref);

        return () => ctx.revert();
    }, [ref]);
}

export default { useStaggerAnimation, useEntranceAnimation, useHoverAnimation, animateElement, usePageTransition };