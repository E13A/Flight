import type { Config } from "tailwindcss";

const config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "2rem",
                lg: "4rem",
                xl: "5rem",
                "2xl": "6rem",
            },
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1400px",
            },
        },
        extend: {
            // Modern Color Palette
            // System colors
            border: "var(--border)",
            input: "var(--input)",
            ring: "var(--ring)",
            background: "var(--background)",
            foreground: "var(--foreground)",
            primary: {
                DEFAULT: "var(--primary)",
                foreground: "var(--primary-foreground)",
            },
            secondary: {
                DEFAULT: "var(--secondary)",
                foreground: "var(--secondary-foreground)",
            },
            destructive: {
                DEFAULT: "var(--destructive)",
                foreground: "var(--destructive-foreground)",
            },
            muted: {
                DEFAULT: "var(--muted)",
                foreground: "var(--muted-foreground)",
            },
            accent: {
                DEFAULT: "var(--accent)",
                foreground: "var(--accent-foreground)",
            },
            popover: {
                DEFAULT: "var(--popover)",
                foreground: "var(--popover-foreground)",
            },
            card: {
                DEFAULT: "var(--card)",
                foreground: "var(--card-foreground)",
            },
            sidebar: {
                DEFAULT: "var(--sidebar)",
                foreground: "var(--sidebar-foreground)",
                primary: "var(--sidebar-primary)",
                "primary-foreground": "var(--sidebar-primary-foreground)",
                accent: "var(--sidebar-accent)",
                "accent-foreground": "var(--sidebar-accent-foreground)",
                border: "var(--sidebar-border)",
                ring: "var(--sidebar-ring)",
            },
            // Modern Typography
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
                'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
                '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
                '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
            },
            // Spacing
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            // Border Radius
            borderRadius: {
                'lg': 'var(--radius)',
                'md': 'calc(var(--radius) - 2px)',
                'sm': 'calc(var(--radius) - 4px)',
                '4xl': '2rem',
            },
            // Modern Shadows
            boxShadow: {
                'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
                'soft-md': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
                'soft-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
                'soft-xl': '0 12px 32px 0 rgba(0, 0, 0, 0.16)',
                'soft-2xl': '0 16px 48px 0 rgba(0, 0, 0, 0.20)',
                'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                'glow-primary': '0 0 20px rgba(59, 130, 246, 0.3)',
                'glow-primary-lg': '0 0 40px rgba(59, 130, 246, 0.5)',
                'glow-secondary': '0 0 20px rgba(139, 92, 246, 0.3)',
                'glow-secondary-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
                'glow-accent': '0 0 20px rgba(236, 72, 153, 0.3)',
                'glow-accent-lg': '0 0 40px rgba(236, 72, 153, 0.5)',
            },
            // Keyframes
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in-down": {
                    "0%": { opacity: "0", transform: "translateY(-20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "slide-in-left": {
                    "0%": { opacity: "0", transform: "translateX(-20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                "slide-in-right": {
                    "0%": { opacity: "0", transform: "translateX(20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                "scale-in": {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                "shimmer": {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "pulse-glow": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" },
                    "50%": { boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-12px)" },
                },
                "bounce-subtle": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
                "ripple": {
                    "0%": { transform: "scale(0)", opacity: "1" },
                    "100%": { transform: "scale(4)", opacity: "0" },
                },
            },
            // Animations
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.6s ease-out",
                "fade-in-up": "fade-in-up 0.6s ease-out",
                "fade-in-down": "fade-in-down 0.6s ease-out",
                "slide-in-left": "slide-in-left 0.5s ease-out",
                "slide-in-right": "slide-in-right 0.5s ease-out",
                "scale-in": "scale-in 0.4s ease-out",
                "shimmer": "shimmer 2s ease-in-out infinite",
                "pulse-glow": "pulse-glow 3s ease-in-out infinite",
                "float": "float 3s ease-in-out infinite",
                "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
                "ripple": "ripple 0.6s ease-out",
            },
            // Background Images
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "gradient-mesh": "radial-gradient(at 40% 20%, hsla(217, 91%, 60%, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(262, 83%, 58%, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(330, 81%, 60%, 0.15) 0px, transparent 50%)",
            },
            // Backdrop Blur
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
export default config;
