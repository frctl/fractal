import React from 'react';

interface RenderCamelCaseVariantProps {
    something: string;
}

const RenderCamelCaseVariant = (props: RenderCamelCaseVariantProps): JSX.Element => {
    return <>Render camelCaseVariant {props.something}</>;
};

export default RenderCamelCaseVariant;
