const React = require('react');
const PropTypes = require('prop-types');

const TreeLeaf = (props) => {
    return <>Tree leaf {props._self.name}</>;
};

TreeLeaf.propTypes = {
    _self: PropTypes.shape({
        name: PropTypes.string,
    }),
};

module.exports = TreeLeaf;
