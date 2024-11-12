// import aspectRatio from '@tailwindcss/aspect-ratio';
// import containerQueries from '@tailwindcss/container-queries';
// import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1440px'
			}
		},
		extend: {
			colors: {
				border: {
					DEFAULT: 'hsl(var(--border-card))',
					input: 'hsl(var(--border-input))',
					'input-hover': 'hsl(var(--border-input-hover))'
				},
				background: {
					DEFAULT: 'hsl(var(--background) / <alpha-value>)',
					alt: 'hsl(var(--background-alt) / <alpha-value>)'
				},
				foreground: {
					DEFAULT: 'hsl(var(--foreground) / <alpha-value>)',
					alt: 'hsl(var(--foreground-alt) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground))'
				},
				dark: {
					DEFAULT: 'hsl(var(--dark) / <alpha-value>)',
					4: 'hsl(var(--dark-04))',
					10: 'hsl(var(--dark-10))',
					40: 'hsl(var(--dark-40))'
				},
				accent: {
					DEFAULT: 'var(--accent)'
				}
			},
			fontFamily: {
				sans: [
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Oxygen',
					'Ubuntu',
					'Cantarell',
					'Fira Sans',
					'Droid Sans',
					'Helvetica Neue',
					'Arial',
					'sans-serif',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol'
				],
				mono: [
					'ui-monospace',
					'SFMono-Regular',
					'SF Mono',
					'Menlo',
					'Consolas',
					'Liberation Mono',
					'monospace'
				]
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						code: {
							position: 'relative',
							borderRadius: theme('borderRadius.md')
						}
					}
				}
			})
		}
	},

	plugins: [
		typography,
		plugin(function ({ addVariant, matchUtilities, theme }) {
			addVariant('hocus', ['&:hover', '&:focus']);
			// Square utility
			matchUtilities(
				{
					square: (value) => ({
						width: value,
						height: value
					})
				},
				{ values: theme('spacing') }
			);
		})
	]
};
