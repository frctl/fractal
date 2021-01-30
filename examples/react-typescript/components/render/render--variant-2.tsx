import React from 'react';

interface RenderVariant2Props {
    something: string;
}

const RenderVariant2 = (props: RenderVariant2Props): JSX.Element => {
    return <>Render variant-2 {props.something}</>;
};

export default RenderVariant2;
