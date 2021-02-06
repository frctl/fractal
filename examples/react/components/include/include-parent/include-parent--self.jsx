const React = require('react');
const PropTypes = require('prop-types');

// TODO: it should be possible to import components by handles
const IncludeChild = require('../include-child/include-child.jsx');

const IncludeParentSelf = (props) => {
    return (
        <>
            {props._self.handle}
            <IncludeChild />
            {props._self.handle}
        </>
    );
};

IncludeParentSelf.propTypes = {
    _self: PropTypes.shape({
        handle: PropTypes.string,
    }),
};

module.exports = IncludeParentSelf;
