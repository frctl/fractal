import React from 'react';

interface RenderProps {
    something: string;
}

const Render = (props: RenderProps): JSX.Element => {
    return <>Render {props.something}</>;
};

export default Render;
