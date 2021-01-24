const React = require('react');
const PropTypes = require('prop-types');

const Yaml = (props) => {
    return <p>{props.text}</p>;
};

Yaml.propTypes = {
    text: PropTypes.string,
};

module.exports = Yaml;
