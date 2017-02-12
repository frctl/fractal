import React from 'react';

export default (props)=> (
    <div className={`Wrapper Wrapper--${props.modifiers}`}>
        {props.children}
    </div>
);
