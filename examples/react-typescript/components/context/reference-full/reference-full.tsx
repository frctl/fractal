import React from 'react';

interface ReferenceFullProps {
    reference: string;
}

const ReferenceFull = (props: ReferenceFullProps): JSX.Element => {
    return <p>{props.reference}</p>;
};

export default ReferenceFull;
