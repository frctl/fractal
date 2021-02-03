import React from 'react';

interface ReferenceFullProps {
    reference: string;
}

const ReferenceFull = (props: ReferenceFullProps): JSX.Element => {
    return <div>{props.reference}</div>;
};

export default ReferenceFull;
