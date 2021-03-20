const React = require('react');

const { usePath } = require('@frctl/react/components');

const Path = () => {
    const path = usePath();
    return <>{path.get('/some-path')}</>;
};

module.exports = Path;
