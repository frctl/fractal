const React = require('react');
const PropTypes = require('prop-types');

const Collated = (props) => {
    return <div>{`Collated component ${props._self.name}`}</div>;
};

Collated.propTypes = {
    _self: PropTypes.shape({
        name: PropTypes.string,
    }),
};

module.exports = Collated;
