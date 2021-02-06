const React = require('react');

const { WrapperContext } = require('../wrapper-provider/wrapper-provider.jsx');

const WrapperConsumer = () => {
    const { getValue } = React.useContext(WrapperContext);

    return <>{getValue('consumer')}</>;
};

module.exports = WrapperConsumer;
