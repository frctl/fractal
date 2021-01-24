const React = require('react');
const PropTypes = require('prop-types');

const Json = (props) => {
    return <p>{props.text}</p>;
};

Json.propTypes = {
    text: PropTypes.string,
};

module.exports = Json;
