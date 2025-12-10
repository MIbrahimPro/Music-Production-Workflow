// Theme configuration - Change colors here to update entire app
export const themeConfig = {
    colors: {
        primary: {
            light: '#18181b',      // zinc-900
            dark: '#fafafa',       // zinc-50
        },
        secondary: {
            light: '#3f3f46',      // zinc-700
            dark: '#d4d4d8',       // zinc-300
        },
        background: {
            light: '#fafafa',      // zinc-50
            dark: '#09090b',       // zinc-950
        },
        surface: {
            light: '#ffffff',
            dark: '#18181b',       // zinc-900
        },
        border: {
            light: '#18181b',      // zinc-900
            dark: '#fafafa',       // zinc-50
        },
        accent: {
            success: '#22c55e',    // green-500
            error: '#ef4444',      // red-500
            warning: '#f59e0b',    // amber-500
        },
        muted: {
            light: '#71717a',      // zinc-500
            dark: '#a1a1aa',       // zinc-400
        }
    },
    animation: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
    },
    borderWidth: '3px',
    shadowOffset: '4px',
};

export default themeConfig;