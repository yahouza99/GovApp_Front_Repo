// Color constants for GovApp
// Primary color: Green (for government/official theme)
// Secondary color: Orange (for accent and highlights)

export const COLORS = {
  // Primary Colors (Green)
  primary: {
    50: '#f0fdf4',   // Very light green
    100: '#dcfce7',  // Light green
    200: '#bbf7d0',  // Lighter green
    300: '#86efac',  // Light green
    400: '#4ade80',  // Medium light green
    500: '#22c55e',  // Main primary green
    600: '#16a34a',  // Dark green
    700: '#15803d',  // Darker green
    800: '#166534',  // Very dark green
    900: '#14532d',  // Darkest green
  },

  // Secondary Colors (Orange)
  secondary: {
    50: '#fff7ed',   // Very light orange
    100: '#ffedd5',  // Light orange
    200: '#fed7aa',  // Lighter orange
    300: '#fdba74',  // Light orange
    400: '#fb923c',  // Medium light orange
    500: '#f97316',  // Main secondary orange
    600: '#ea580c',  // Dark orange
    700: '#c2410c',  // Darker orange
    800: '#9a3412',  // Very dark orange
    900: '#7c2d12',  // Darkest orange
  },

  // Neutral Colors (Gray scale)
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Status Colors
  success: '#22c55e',  // Green (same as primary-500)
  warning: '#f59e0b',  // Amber
  error: '#ef4444',    // Red
  info: '#3b82f6',     // Blue

  // Background Colors
  background: {
    light: '#ffffff',
    gray: '#f9fafb',
    dark: '#111827',
  },

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    light: '#ffffff',
  },
};

// CSS Custom Properties for easy usage
export const CSS_VARIABLES = {
  '--color-primary': COLORS.primary[500],
  '--color-primary-light': COLORS.primary[400],
  '--color-primary-dark': COLORS.primary[600],
  '--color-secondary': COLORS.secondary[500],
  '--color-secondary-light': COLORS.secondary[400],
  '--color-secondary-dark': COLORS.secondary[600],
  '--color-success': COLORS.success,
  '--color-warning': COLORS.warning,
  '--color-error': COLORS.error,
  '--color-info': COLORS.info,
};

// Tailwind CSS class names for easy usage
export const TAILWIND_COLORS = {
  primary: {
    bg: 'bg-green-500',
    bgHover: 'hover:bg-green-600',
    bgLight: 'bg-green-400',
    bgDark: 'bg-green-600',
    text: 'text-green-500',
    textHover: 'hover:text-green-600',
    border: 'border-green-500',
    borderHover: 'hover:border-green-600',
    ring: 'ring-green-500',
    focusRing: 'focus:ring-green-500',
  },
  secondary: {
    bg: 'bg-orange-500',
    bgHover: 'hover:bg-orange-600',
    bgLight: 'bg-orange-400',
    bgDark: 'bg-orange-600',
    text: 'text-orange-500',
    textHover: 'hover:text-orange-600',
    border: 'border-orange-500',
    borderHover: 'hover:border-orange-600',
    ring: 'ring-orange-500',
    focusRing: 'focus:ring-orange-500',
  },
};

export default COLORS;
