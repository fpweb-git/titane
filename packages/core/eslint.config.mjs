import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        rules: {
            'no-console': 'warn',
            '@typescript-eslint/no-explicit-any': 'error',
            'semi': ['error', 'always']
        }
    },
    {
        ignores: ['dist/**', 'node_modules/**']
    }
];