/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
        keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out',
      },
    
  
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui'],
        serif: ['ui-serif', 'Georgia'],
        mono: ['ui-monospace', 'SFMono-Regular'],
        display: ['Oswald'],
        body: ['"Open Sans"'],
        heading: ['quicksand'],
      },
      button: {},
      textColor: {
        'dark-blue': '#003366',
        'dark-navy': '#080d4e',
        'electric-violet': '#5c0dff',
        serene: '#5ad493',
        peach: '#fa8a59',
        skyBlue: '#6ca3e8',
        'navy-blue': '#35495E',
      },
      backgroundColor: {
        'primary-blue': '#003366',
        'secondary-yellow': '#e7b416',
        'electric-violet': '#5c0dff',
        'winter-sky-blue': '#f8fcff',
        'new-blue' : '#184883',
        serene: '#d7fbea',
        mint: '#a4eac4',
        peach: '#f9eee8',
        tangerine: '#fcd2bb',
        skyfall: '#e5f1fd',
        cerulean: '#5199f5',
        'light-gray': '#ECECEC',
        'dark-blue': '#003366',
        'polynesian-blue': '#204A9B',
        'new-color': '#c8d3df',
        'gradient-radial-custom': 'radial-gradient(circle, rgba(226, 229, 233, 1) 50%, rgba(195, 218, 249, 1) 100%)'
        
      },
      
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
     
    },
  },
  plugins: [require('tailwindcss-animate')],
};
