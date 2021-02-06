const React = require('react');
const PropTypes = require('prop-types');

const ReferenceFull = (props) => {
    return <div>{props.reference}</div>;
};

ReferenceFull.propTypes = {
    reference: PropTypes.string,
};

module.exports = ReferenceFull;
