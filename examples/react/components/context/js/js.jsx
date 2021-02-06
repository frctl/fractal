const React = require('react');
const PropTypes = require('prop-types');

const Js = (props) => {
    return <p>{props.text}</p>;
};

Js.propTypes = {
    text: PropTypes.string,
};

module.exports = Js;
