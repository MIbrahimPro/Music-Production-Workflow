import { memo, forwardRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Input = memo(forwardRef(function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    disabled = false,
    required = false,
    name,
    id,
    autoComplete,
    className = '',
    ...props
}, ref) {
    const { isDark } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || name;

    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={`
            text-[10px] font-bold uppercase tracking-wider
            ${isDark ? 'text-zinc-300' : 'text-zinc-700'}
            transition-colors duration-200
          `}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    ref={ref}
                    type={type}
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`
            w-full px-3 py-2 text-sm font-medium
            border-[2px] transition-all duration-200
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isDark
                            ? `bg-zinc-900 text-zinc-50 border-zinc-700 
                 placeholder-zinc-500
                 focus:border-zinc-50 focus:shadow-[3px_3px_0px_0px_rgba(250,250,250,0.2)]`
                            : `bg-white text-zinc-900 border-zinc-300 
                 placeholder-zinc-400
                 focus:border-zinc-900 focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]`
                        }
            ${error
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }
            ${isFocused
                            ? 'translate-x-[-2px] translate-y-[-2px]'
                            : ''
                        }
          `}
                    {...props}
                />
            </div>

            {error && (
                <span className="text-red-500 text-[10px] font-medium flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </span>
            )}
        </div>
    );
}));

export default Input;