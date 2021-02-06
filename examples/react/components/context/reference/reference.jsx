const React = require('react');
const PropTypes = require('prop-types');

const Reference = (props) => {
    return <p>{props.parent.text}</p>;
};

Reference.propTypes = {
    parent: PropTypes.shape({
        text: PropTypes.string,
    }),
};

module.exports = Reference;
