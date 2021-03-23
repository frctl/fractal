const React = require('react');
const PropTypes = require('prop-types');

const PathContext = React.createContext({
    get: (path) => path,
});

const PathProvider = (props) => {
    const { children, ...rest } = props;

    return React.createElement(PathContext.Provider, { value: rest }, children);
};

PathProvider.propTypes = {
    children: PropTypes.node,
    get: PropTypes.func,
};

const usePath = () => {
    return React.useContext(PathContext);
};

module.exports = PathProvider;
module.exports.PathContext = PathContext;
module.exports.usePath = usePath;
