import React from 'react';

interface ReferenceProps {
    parent: {
        text: string;
    };
}

const Reference = (props: ReferenceProps): JSX.Element => {
    return <p>{props.parent.text}</p>;
};

export default Reference;
