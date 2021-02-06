const React = require('react');
const PropTypes = require('prop-types');

const RenderCamelCaseVariant = (props) => {
    return <>Render camelCaseVariant {props.something}</>;
};

RenderCamelCaseVariant.propTypes = {
    something: PropTypes.string,
};

module.exports = RenderCamelCaseVariant;
