import React from 'react';

import { WrapperContext } from '../wrapper-provider/wrapper-provider';

const WrapperConsumer = (): JSX.Element => {
    const { getValue } = React.useContext(WrapperContext);

    return <>{getValue('consumer')}</>;
};

export default WrapperConsumer;
