import { memo, forwardRef, useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

const PasswordInput = memo(forwardRef(function PasswordInput({
    label = 'Password',
    value = '',
    onChange,
    onBlur,
    showValidation = false,
    error,
    disabled = false,
    required = false,
    name = 'password',
    id,
    placeholder = 'Enter your password',
    className = '',
    ...props
}, ref) {
    const { isDark } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || name;

    const validations = useMemo(() => [
        {
            label: 'Min 8 characters',
            test: (val) => val.length >= 8,
        },
        {
            label: 'Uppercase letter',
            test: (val) => /[A-Z]/.test(val),
        },
        {
            label: 'Lowercase letter',
            test: (val) => /[a-z]/.test(val),
        },
        {
            label: 'Number',
            test: (val) => /\d/.test(val),
        },
        {
            label: 'Special char (!@#$%^&*)',
            test: (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
        },
    ], []);

    const validationResults = useMemo(() =>
        validations.map(v => ({
            ...v,
            isValid: v.test(value),
        }))
        , [value, validations]);

    const allValid = validationResults.every(v => v.isValid);

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
                    type={showPassword ? 'text' : 'password'}
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`
            w-full px-3 py-2 pr-10 text-sm font-medium
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
            ${error && !showValidation ? 'border-red-500' : ''}
            ${showValidation && value && allValid ? 'border-green-500' : ''}
            ${isFocused ? 'translate-x-[-2px] translate-y-[-2px]' : ''}
          `}
                    {...props}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`
            absolute right-2.5 top-1/2 -translate-y-1/2
            p-0.5 transition-colors duration-200
            ${isDark
                            ? 'text-zinc-400 hover:text-zinc-50'
                            : 'text-zinc-500 hover:text-zinc-900'
                        }
          `}
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Validation indicators */}
            {showValidation && value && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
                    {validationResults.map((validation, index) => (
                        <div
                            key={index}
                            className={`
                flex items-center gap-1.5 text-[10px] font-medium
                transition-all duration-200
                ${validation.isValid
                                    ? 'text-green-500'
                                    : isDark ? 'text-zinc-500' : 'text-zinc-400'
                                }
              `}
                        >
                            {validation.isValid ? (
                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span>{validation.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {error && !showValidation && (
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

export default PasswordInput;