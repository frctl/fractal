module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: {
        content: ['./components/**/*'],
    },
    theme: {
        extend: {},
        container: {
            center: true,
            padding: {
                default: '1rem',
            },
        },
    },
    variants: {
        translate: ['responsive', 'hover', 'focus', 'group-hover'],
    },
    plugins: [],
};
