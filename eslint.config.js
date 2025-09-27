import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
				svelteFeatures: {
					experimentalGenerics: true
				},
				extraFileExtensions: ['.svelte', '.svelte.ts']
			}
		}
	},

	{
		rules: {
			'no-undef': 'off',
			eqeqeq: 'warn',
			'svelte/require-each-key': 'off',
			'prefer-const': ['error', { ignoreReadBeforeAssign: true, destructuring: 'all' }],
			'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
			'no-debugger': 'warn',
			'no-unused-vars': 'off', // TypeScript handles this better
			'no-var': ['error'],

			// TypeScript specifics
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					disallowTypeAnnotations: false
				}
			],
			'@typescript-eslint/no-empty-interface': 'warn',
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
);
