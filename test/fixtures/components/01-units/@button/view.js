import React from 'react';

export default function (props) {
    return React.createElement(
        'div',
        props,
        React.createElement('input', { value: '' + props.value, className: 'Input Input--' + props.modifiers, onChange: props.onChange })
    );
}
