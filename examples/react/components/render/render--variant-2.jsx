const React = require('react');
const PropTypes = require('prop-types');

const RenderVariant2 = (props) => {
    return <>Render variant-2 {props.something}</>;
};

RenderVariant2.propTypes = {
    something: PropTypes.string,
};

module.exports = RenderVariant2;
