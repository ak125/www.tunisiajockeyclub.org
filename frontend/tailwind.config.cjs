const path = require('path');
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [path.join(__dirname,'./app/**/*.{js,jsx,ts,tsx}')],
    theme: {
        extend: {
            colors: {
                // === NOUVEAU DESIGN SYSTEM INSTITUTIONNEL ===
                // Marque principale - Vert institution
                'brand': {
                    50: '#F0FDFA',
                    100: '#CCFBF1',
                    200: '#99F6E4',
                    300: '#5EEAD4',
                    400: '#2DD4BF',
                    500: '#0F766E', // Couleur principale
                    600: '#0A7A6D', // Hover
                    700: '#0F5A54',
                    800: '#134E4A',
                    900: '#164139'
                },
                
                // Accent - Rouge Tunisie (usage parcimonieux)
                'accent': {
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    200: '#FECACA',
                    300: '#FCA5A5',
                    400: '#F87171',
                    500: '#D21C1C', // Rouge Tunisie
                    600: '#B91C1C',
                    700: '#991B1B',
                    800: '#7F1D1D',
                    900: '#5B0F0F'
                },

                // === COULEURS HÉRITÉES (compatibilité) ===
                khmerCurry: '#ED5555',
                persianIndigo: '#350B60',
                vert: '#1FDC93',
                bleu: '#031754',
                bleuClair: '#D0EDFC',
                lightTurquoise: '#E2F2F1',
                extraLightTurquoise: '#F3F8F8',
                darkIron: '#B0B0B0',
                iron: '#EEEEEE',
                
                // Palette hippique premium (conservation)
                'turf-green': {
                    50: '#F0F7ED',
                    100: '#DEEDCE',
                    200: '#C1DDA2',
                    300: '#9BC66D',
                    400: '#7AAB42',
                    500: '#2D5016',
                    600: '#254215',
                    700: '#1E3312',
                    800: '#19290F',
                    900: '#16240E'
                },
                'racing-gold': {
                    50: '#FFFEF7',
                    100: '#FFFCEB',
                    200: '#FFF9D6',
                    300: '#FFF3B3',
                    400: '#FFEA80',
                    500: '#FFD700',
                    600: '#E6C200',
                    700: '#B39800',
                    800: '#806D00',
                    900: '#594C00'
                },
                'stable-blue': {
                    50: '#EFF2FF',
                    100: '#DDE4FF',
                    200: '#C2CDFF',
                    300: '#9CAAFE',
                    400: '#7481FB',
                    500: '#1E3A8A',
                    600: '#1C347D',
                    700: '#182D6B',
                    800: '#152559',
                    900: '#131F4A'
                },

                // === SYSTÈME SHADCN/UI (conservation) ===
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },

            // === DESIGN SYSTEM SPACING ===
            spacing: {
                'section-mobile': '5rem',   // py-20
                'section-desktop': '6rem',  // py-24
                'component': '2rem',        // py-8
                'tight': '1rem'             // py-4
            },

            // === DESIGN SYSTEM CONTAINERS ===
            maxWidth: {
                'container': '72rem',       // max-w-6xl - nouvelle norme
                '7xl': '80rem',            // conservation existant
                '8xl': '88rem'
            },

            // === TYPOGRAPHIE SYSTÈME ===
            fontFamily: {
                'sans': ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
                'mono': ['SF Mono', 'Monaco', 'Cascadia Code', 'monospace'],
                // Conservation existante
                'serif': ['Playfair Display', 'serif'],
                'display': ['Cinzel', 'serif']
            },

            fontSize: {
                'hero': ['3rem', { lineHeight: '1.25', fontWeight: '700' }],      // text-5xl
                'section': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }], // text-3xl
                'subtitle': ['1.25rem', { lineHeight: '1.375', fontWeight: '500' }]  // text-xl
            },

            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },

            // === ANIMATIONS INSTITUTIONNELLES ===
            animation: {
                // Nouvelles animations subtiles
                'fade-in-up': 'fade-in-up 0.6s ease-out',
                'slide-in-right': 'slide-in-right 0.5s ease-out',
                'scale-in-bounce': 'scale-in-bounce 0.4s ease-out',
                
                // Conservation existantes
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-subtle': 'bounceSubtle 0.6s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-slow': 'pulse 3s infinite',
                'float': 'float 3s ease-in-out infinite',
                'gradient': 'gradient 3s ease infinite'
            },

            keyframes: {
                // Nouvelles keyframes institutionnelles
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                'scale-in-bounce': {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },

                // Conservation existantes
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                bounceSubtle: {
                    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-4px)' },
                    '60%': { transform: 'translateY(-2px)' }
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                }
            },

            // === OMBRES INSTITUTIONNELLES ===
            boxShadow: {
                'institutional': '0 10px 40px rgba(15, 118, 110, 0.15)',
                'accent-glow': '0 10px 40px rgba(210, 28, 28, 0.2)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'neomorphism': '20px 20px 60px #d1d9e6, -20px -20px 60px #ffffff',
                'neomorphism-inset': 'inset 20px 20px 60px #d1d9e6, inset -20px -20px 60px #ffffff',
                'racing': '0 10px 40px rgba(255, 215, 0, 0.3)',
                'turf': '0 10px 40px rgba(45, 80, 22, 0.2)'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
