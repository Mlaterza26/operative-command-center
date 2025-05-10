
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				operative: {
					red: "#A71930", 
					coral: "#FF1B3D",
					black: "#222222",
					pending: "#FFF59D",
					approved: "#A5D6A7",
					unapproved: "#FFAB91",
					// Miami Vice theme colors
					navy: "#03002C",
					"navy-light": "#11085A",
					blue: "#1300FF",
					teal: "#00F0FF",
					success: "#00F0FF",
					warning: "#FF1B3D",
					error: "#FF1B3D",
					"text-body": "#F0F0FF",
					border: "#1300FF"
				}
			},
			fontFamily: {
				sans: ["'Chakra Petch'", "Inter", "system-ui", "sans-serif"],
				mono: ["IBM Plex Mono", "monospace"],
				retro: ["'Orbitron'", "'Chakra Petch'", "sans-serif"],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 0.5rem)',
				sm: 'calc(var(--radius) - 1rem)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': { 
						opacity: '1',
						boxShadow: '0 0 0 0 rgba(19, 0, 255, 0)' 
					},
					'50%': { 
						opacity: '0.8',
						boxShadow: '0 0 0 4px rgba(19, 0, 255, 0.6)' 
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(8px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'subtle-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-2px)' }
				},
				'neon-flicker': {
					'0%, 100%': { 
						opacity: '1',
						textShadow: '0 0 5px rgba(19, 0, 255, 0.7), 0 0 10px rgba(19, 0, 255, 0.5)'
					},
					'50%': { 
						opacity: '0.8',
						textShadow: '0 0 10px rgba(19, 0, 255, 0.9), 0 0 20px rgba(19, 0, 255, 0.7)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in': 'fade-in 0.3s ease-out',
				'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
				'neon-flicker': 'neon-flicker 2s ease-in-out infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'grid-pattern': 'linear-gradient(to right, #1300FF 1px, transparent 1px), linear-gradient(to bottom, #1300FF 1px, transparent 1px)',
				'miami-gradient': 'linear-gradient(90deg, #1300FF, #A71930)',
				'miami-gradient-reverse': 'linear-gradient(90deg, #A71930, #1300FF)',
			},
			boxShadow: {
				'glow-sm': '0 0 10px rgba(19, 0, 255, 0.5)',
				'glow-md': '0 0 15px rgba(19, 0, 255, 0.6)',
				'card-hover': '0 8px 30px rgba(0, 0, 0, 0.3), 0 0 1px rgba(19, 0, 255, 0.5)',
				'neon': '0 0 10px rgba(19, 0, 255, 0.7), 0 0 20px rgba(19, 0, 255, 0.4)',
				'neon-red': '0 0 10px rgba(167, 25, 48, 0.7), 0 0 20px rgba(167, 25, 48, 0.4)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
