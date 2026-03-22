import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
    {
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/max-attributes-per-line': ['error', {
                singleline: { max: 3 },
                multiline: { max: 1 }
            }],
            'vue/html-closing-bracket-newline': ['error', {
                singleline: 'never',
                multiline: 'always'
            }],
            'vue/first-attribute-linebreak': ['error', {
                singleline: 'ignore',
                multiline: 'below'
            }]
        }
    }
]);