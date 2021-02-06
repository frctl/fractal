const React = require('react');
const PropTypes = require('prop-types');

const ReferenceKey = (props) => {
    return <p>{props.text}</p>;
};

ReferenceKey.propTypes = {
    text: PropTypes.string,
};

module.exports = ReferenceKey;
