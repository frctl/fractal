import React from 'react';

interface ReferenceKeyProps {
    text: string;
}

const ReferenceKey = (props: ReferenceKeyProps): JSX.Element => {
    return <p>{props.text}</p>;
};

export default ReferenceKey;
