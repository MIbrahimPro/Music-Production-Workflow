import React, { useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

// Spinner component to use the custom 'equalize' animation
const LoadingSpinner = ({ color = '[--color-accent]' }) => (
    <div className="flex space-x-1 justify-center items-center">
        <div className={`w-1 h-3 rounded-full bg-` + color + ` animate-[equalize_1s_ease-in-out_infinite]`} style={{ animationDelay: '0s' }}></div>
        <div className={`w-1 h-3 rounded-full bg-` + color + ` animate-[equalize_1s_ease-in-out_infinite]`} style={{ animationDelay: '0.2s' }}></div>
        <div className={`w-1 h-3 rounded-full bg-` + color + ` animate-[equalize_1s_ease-in-out_infinite]`} style={{ animationDelay: '0.4s' }}></div>
        <div className={`w-1 h-3 rounded-full bg-` + color + ` animate-[equalize_1s_ease-in-out_infinite]`} style={{ animationDelay: '0.6s' }}></div>
    </div>
);

const InputField = ({ Icon, type, placeholder, value, onChange }) => (
    <div className="relative mb-6">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[--color-gray-400]" />
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="input-animated w-full px-12 py-3 glass rounded-lg border-2 border-[--color-gray-300] focus:border-[--color-accent] text-[--color-black] transition-all duration-300 placeholder-[--color-gray-500] focus:outline-none"
            // Tailwind v4 uses the custom property directly
            style={{
                '--tw-focus-ring-shadow': '0 0 0 3px var(--color-accent)', // Custom focus glow based on your CSS
            }}
        />
    </div>
);

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            console.log(isLogin ? 'Logging in with:' : 'Signing up with:', form);
            setIsLoading(false);
        }, 2000);
    };

    const switchForm = () => {
        setIsLogin(!isLogin);
        setForm({ username: '', email: '', password: '' });
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen p-4 bg-[--color-gray-800]"
            style={{
                backgroundImage: 'radial-gradient(var(--color-gray-400) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
            }}
        >
            <div className="w-full h-full flex flex-col justify-center items-center max-w-md p-8 rounded-2xl glass-light shadow-xl">
                <h2 className="text-4xl font-bold mb-8 text-center text-[--color-white] text-glow">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <InputField
                            Icon={User}
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={form.username}
                            onChange={handleInputChange}
                        />
                    )}

                    <InputField
                        Icon={Mail}
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                    />

                    <InputField
                        Icon={Lock}
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={form.password}
                        onChange={handleInputChange}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 mt-4 mb-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center 
              bg-[--color-primary] text-[--color-white] glow-accent glow-accent-hover active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? (
                            <LoadingSpinner color="[--color-white]" />
                        ) : isLogin ? (
                            'Log In'
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <p className="text-center text-[--color-gray-300]">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button
                        onClick={switchForm}
                        className="ml-2 font-medium text-[--color-accent] hover:text-[--color-light] transition-colors duration-300"
                        disabled={isLoading}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;