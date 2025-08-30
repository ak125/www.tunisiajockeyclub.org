/**
 * TUNISIA JOCKEY CLUB - DESIGN SYSTEM EXECUTIVE
 * Version: 2.0 Professional Authority
 * Institution: Autorité Officielle des Sports Hippiques
 */

// =============================================================================
// 🎨 COLOR TOKENS - PROFESSIONAL AUTHORITY PALETTE
// =============================================================================

export const colors = {
  // Primary - Institutional Blue & Slate
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9', 
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  
  // Authority - Deep Professional
  authority: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe', 
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81'
  },
  
  // Success - Official Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  
  // Warning - Alert Orange  
  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12'
  },
  
  // Critical - Urgent Red
  critical: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  
  // Ministerial - Government Purple
  ministerial: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87'
  }
};

// =============================================================================
// 📐 TYPOGRAPHY SYSTEM - INSTITUTIONAL HIERARCHY
// =============================================================================

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Merriweather', 'Georgia', 'serif'],
    mono: ['JetBrains Mono', 'Menlo', 'monospace']
  },
  
  fontSize: {
    // Headlines - Official
    'headline-xl': ['4.5rem', { lineHeight: '1', fontWeight: '900', letterSpacing: '-0.025em' }],
    'headline-lg': ['3.75rem', { lineHeight: '1', fontWeight: '900', letterSpacing: '-0.025em' }],
    'headline-md': ['3rem', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.025em' }],
    'headline-sm': ['2.25rem', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.025em' }],
    
    // Titles - Professional
    'title-xl': ['1.875rem', { lineHeight: '1.2', fontWeight: '700' }],
    'title-lg': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
    'title-md': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
    'title-sm': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
    
    // Body - Readable
    'body-xl': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
    'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
    'body-md': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
    'body-sm': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
    
    // Labels - System
    'label-xl': ['0.875rem', { lineHeight: '1.4', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }],
    'label-lg': ['0.75rem', { lineHeight: '1.4', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }],
    'label-md': ['0.6875rem', { lineHeight: '1.4', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }],
    'label-sm': ['0.625rem', { lineHeight: '1.3', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }]
  }
};

// =============================================================================
// 📏 SPACING SYSTEM - CONSISTENT RHYTHM
// =============================================================================

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem', 
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem'
};

// =============================================================================
// 🎭 SHADOWS - DEPTH & ELEVATION
// =============================================================================

export const shadows = {
  // Subtle - Card elevations
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  
  // Executive - Premium elevations
  'executive-sm': '0 4px 20px rgba(0, 0, 0, 0.08)',
  'executive-md': '0 8px 30px rgba(0, 0, 0, 0.12)',
  'executive-lg': '0 15px 40px rgba(0, 0, 0, 0.15)',
  'executive-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Authority - Official elements
  'authority': '0 8px 32px rgba(79, 70, 229, 0.15)',
  'ministerial': '0 8px 32px rgba(147, 51, 234, 0.15)',
  'critical': '0 8px 32px rgba(239, 68, 68, 0.15)'
};

// =============================================================================
// 🎯 BORDER RADIUS - MODERN CONSISTENCY
// =============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',  
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px'
};

// =============================================================================
// ⚡ ANIMATION TOKENS - SMOOTH INTERACTIONS
// =============================================================================

export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms'
  },
  
  easing: {
    linear: 'linear',
    ease: 'ease',
    'ease-in': 'cubic-bezier(0.4, 0.0, 1, 1)',
    'ease-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    'executive': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
};

// =============================================================================
// 🏗️ COMPONENT SYSTEM - REUSABLE PATTERNS
// =============================================================================

export const components = {
  // Cards - Information containers
  card: {
    base: 'bg-white rounded-2xl border border-slate-100 shadow-lg',
    hover: 'hover:shadow-xl transition-all duration-300',
    executive: 'shadow-executive-md hover:shadow-executive-lg'
  },
  
  // Badges - Status indicators
  badge: {
    base: 'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide',
    official: 'bg-authority-100 text-authority-800 border border-authority-200',
    urgent: 'bg-critical-100 text-critical-800 border border-critical-200',
    success: 'bg-success-100 text-success-800 border border-success-200'
  },
  
  // Buttons - Interactive elements
  button: {
    base: 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4',
    primary: 'bg-gradient-to-r from-authority-700 to-primary-800 text-white shadow-authority hover:shadow-executive-lg',
    secondary: 'bg-white text-primary-900 border-2 border-primary-300 hover:border-primary-900',
    executive: 'bg-gradient-to-r from-authority-900 to-primary-900 text-white shadow-executive-md hover:shadow-executive-xl transform hover:-translate-y-0.5'
  }
};

// =============================================================================
// 📱 BREAKPOINTS - RESPONSIVE DESIGN
// =============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px'
};

// =============================================================================
// 🎛️ USAGE EXAMPLES & DOCUMENTATION
// =============================================================================

export const designSystemExamples = {
  // Executive Card Example
  executiveCard: 'bg-white rounded-3xl shadow-executive-lg border border-slate-100 p-8 hover:shadow-executive-xl transition-all duration-500',
  
  // Authority Badge Example  
  authorityBadge: 'bg-authority-100 text-authority-800 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border border-authority-200',
  
  // Executive Button Example
  executiveButton: 'px-8 py-3 bg-gradient-to-r from-authority-900 to-primary-900 text-white font-semibold rounded-2xl shadow-executive-md hover:shadow-executive-xl transition-all duration-300 transform hover:-translate-y-0.5',
  
  // Professional Typography
  professionalTitle: 'text-3xl font-black text-primary-900 mb-4 tracking-tight',
  institutionalSubtitle: 'text-lg text-primary-600 font-medium leading-relaxed'
};

export default {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  animation,
  components,
  breakpoints,
  designSystemExamples
};
