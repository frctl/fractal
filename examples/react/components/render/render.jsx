const React = require('react');
const PropTypes = require('prop-types');

const Render = (props) => {
    return <>Render {props.something}</>;
};

Render.propTypes = {
    something: PropTypes.string,
};

module.exports = Render;
