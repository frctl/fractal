const React = require('react');
const PropTypes = require('prop-types');

const ReferenceFull = (props) => {
    return <p>{props.reference}</p>;
};

ReferenceFull.propTypes = {
    reference: PropTypes.string,
};

module.exports = ReferenceFull;
