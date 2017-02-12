import React from 'react';
export default (props) => (
    <html>
        <head>
            <title>{ props.title }</title>
            <style>{` input { color: purple; font-family: sans-serif; font-size: 16px; } body { background: papayawhip; } `}</style>
        </head>
        <body>
            <div dangerouslySetInnerHTML={{__html: props.yield }}></div>
            JSX Preview
        </body>
    </html>
)
