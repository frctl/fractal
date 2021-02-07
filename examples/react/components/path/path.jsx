const React = require('react');

const {
    components: {
        PathProvider: { usePath },
    },
} = require('@frctl/react');

const Path = () => {
    const path = usePath();
    return <>{path.get('/some-path')}</>;
};

module.exports = Path;
