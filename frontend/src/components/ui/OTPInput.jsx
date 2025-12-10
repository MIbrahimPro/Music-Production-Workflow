import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import gsap from 'gsap';

const OTPInput = memo(function OTPInput({
    length = 6,
    value = '',
    onChange,
    onComplete,
    error,
    disabled = false,
    className = '',
}) {
    const { isDark } = useTheme();
    const [otp, setOtp] = useState(value.split('').slice(0, length));
    const inputRefs = useRef([]);
    const containerRef = useRef(null);

    useEffect(() => {
        setOtp(value.split('').slice(0, length));
    }, [value, length]);

    // Entrance animation
    useEffect(() => {
        if (!containerRef.current) return;

        const inputs = containerRef.current.querySelectorAll('input');
        gsap.fromTo(
            inputs,
            { opacity: 0, y: 10, scale: 0.9 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.3,
                stagger: 0.05,
                ease: 'back.out(1.7)',
            }
        );
    }, []);

    const focusInput = useCallback((index) => {
        if (inputRefs.current[index]) {
            inputRefs.current[index].focus();
            inputRefs.current[index].select();
        }
    }, []);

    const handleChange = useCallback((index, e) => {
        const val = e.target.value;

        if (val && !/^\d+$/.test(val)) return;

        const newOtp = [...otp];

        if (val.length > 1) {
            const pastedData = val.slice(0, length - index);
            for (let i = 0; i < pastedData.length; i++) {
                if (index + i < length) {
                    newOtp[index + i] = pastedData[i];
                }
            }
            setOtp(newOtp);
            const nextIndex = Math.min(index + pastedData.length, length - 1);
            focusInput(nextIndex);
        } else {
            newOtp[index] = val;
            setOtp(newOtp);

            if (val && index < length - 1) {
                focusInput(index + 1);
            }
        }

        const otpString = newOtp.join('');
        onChange?.(otpString);

        if (otpString.length === length) {
            onComplete?.(otpString);
        }
    }, [otp, length, onChange, onComplete, focusInput]);

    const handleKeyDown = useCallback((index, e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = '';
                setOtp(newOtp);
                onChange?.(newOtp.join(''));
            } else if (index > 0) {
                newOtp[index - 1] = '';
                setOtp(newOtp);
                onChange?.(newOtp.join(''));
                focusInput(index - 1);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            focusInput(index - 1);
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            e.preventDefault();
            focusInput(index + 1);
        }
    }, [otp, length, onChange, focusInput]);

    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

        if (pastedData) {
            const newOtp = pastedData.split('');
            while (newOtp.length < length) {
                newOtp.push('');
            }
            setOtp(newOtp);
            onChange?.(pastedData);

            if (pastedData.length === length) {
                onComplete?.(pastedData);
            }

            focusInput(Math.min(pastedData.length, length - 1));
        }
    }, [length, onChange, onComplete, focusInput]);

    return (
        <div ref={containerRef} className={`flex flex-col gap-2 ${className}`}>
            <div className="flex justify-center gap-2">
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={length}
                        value={otp[index] || ''}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onFocus={(e) => e.target.select()}
                        disabled={disabled}
                        className={`
              w-10 h-11 sm:w-11 sm:h-12 text-center text-lg font-bold
              border-[2px] transition-all duration-200
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isDark
                                ? `bg-zinc-900 text-zinc-50 border-zinc-700 
                   focus:border-zinc-50 focus:shadow-[3px_3px_0px_0px_rgba(250,250,250,0.2)]`
                                : `bg-white text-zinc-900 border-zinc-300 
                   focus:border-zinc-900 focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]`
                            }
              ${otp[index]
                                ? isDark
                                    ? 'border-zinc-50'
                                    : 'border-zinc-900'
                                : ''
                            }
              ${error ? 'border-red-500 focus:border-red-500' : ''}
            `}
                        aria-label={`OTP digit ${index + 1}`}
                    />
                ))}
            </div>

            {error && (
                <span className="text-red-500 text-[10px] font-medium text-center flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </span>
            )}
        </div>
    );
});

export default OTPInput;