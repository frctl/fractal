const React = require('react');

// TODO: it should be possible to import components by handles
const IncludeChild = require('../include-child/include-child.jsx');

const IncludeParent = () => {
    return (
        <>
            include parent
            <IncludeChild />
        </>
    );
};

module.exports = IncludeParent;
