const React = require('react');

const { usePath } = require('@frctl/react');

const Path = () => {
    const path = usePath();
    return <>{path.get('/some-path')}</>;
};

module.exports = Path;
