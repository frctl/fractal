import React from 'react';

interface CollatedProps {
    _self: {
        name: string;
    };
}

const Collated = (props: CollatedProps): JSX.Element => {
    return <div>{`Collated component ${props._self.name}`}</div>;
};

export default Collated;
