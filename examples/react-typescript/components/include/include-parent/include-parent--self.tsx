import React from 'react';

// TODO: it should be possible to import components by handles
import IncludeChild from '../include-child/include-child';

interface IncludeParentSelfProps {
    _self: {
        handle: string;
    };
}

const IncludeParentSelf = (props: IncludeParentSelfProps): JSX.Element => {
    return (
        <>
            {props._self.handle}
            <IncludeChild />
            {props._self.handle}
        </>
    );
};

export default IncludeParentSelf;
