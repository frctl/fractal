import React from 'react';

interface JsProps {
    text: string;
}

const Js = (props: JsProps): JSX.Element => {
    return <p>{props.text}</p>;
};

export default Js;
