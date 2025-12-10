import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const OTPPage = lazy(() => import('./pages/OTPPage'));
const NonVerifiedPage = lazy(() => import('./pages/NonVerifiedPage'));
const DeactivatedPage = lazy(() => import('./pages/DeactivatedPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage'));

// Loading component
function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors">
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-end gap-1">
                    {[0.6, 1, 0.75, 0.9, 0.5].map((height, i) => (
                        <div
                            key={i}
                            className="w-2 bg-zinc-900 dark:bg-zinc-50"
                            style={{
                                height: `${height * 40}px`,
                                animation: `equalizer ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                                animationDelay: `${i * 0.1}s`,
                            }}
                        />
                    ))}
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                    Loading...
                </span>
                <style>{`
          @keyframes equalizer {
            0% { transform: scaleY(0.3); }
            100% { transform: scaleY(1); }
          }
        `}</style>
            </div>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Auth Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                        {/* OTP Verification Routes */}
                        <Route path="/verify-email" element={<OTPPage />} />
                        <Route path="/verify-reset" element={<OTPPage />} />

                        {/* Password Routes */}
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/change-password" element={<ChangePasswordPage />} />

                        {/* Status Pages */}
                        <Route path="/non-verified" element={<NonVerifiedPage />} />
                        <Route path="/suspended" element={<DeactivatedPage />} />
                        <Route path="/deactivated" element={<DeactivatedPage />} />

                        {/* Role Selection */}
                        <Route path="/role-selection" element={<RoleSelectionPage />} />

                        {/* Contact */}
                        <Route path="/contact" element={<ContactPage />} />

                        {/* Default redirect */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;