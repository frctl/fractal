import React from 'react';

interface JsonProps {
    text: string;
}

const Json = (props: JsonProps): JSX.Element => {
    return <p>{props.text}</p>;
};

export default Json;
