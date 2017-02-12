import React from 'react';
import {default as Wrapper} from './_src/wrapper.jsx';


export default (props)=> (
    <Wrapper {...props}>
        <input value={`${props.value}`} className={`Input Input--${props.modifiers}`} onChange={props.onChange}/>
    </Wrapper>
);
