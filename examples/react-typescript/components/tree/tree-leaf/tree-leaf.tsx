import React from 'react';

interface TreeLeafProps {
    _self: {
        name: string;
    };
}

const TreeLeaf = (props: TreeLeafProps): JSX.Element => {
    return <>Tree leaf {props._self.name}</>;
};

export default TreeLeaf;
