import React from 'react';

import IncludeChild from '../include-child/include-child';

const IncludeParent = (): JSX.Element => {
    return (
        <>
            include parent
            <IncludeChild />
        </>
    );
};

export default IncludeParent;
