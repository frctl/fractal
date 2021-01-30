import React from 'react';

interface PreviewProps {
    yield: string;
}

const Preview = (props: PreviewProps): JSX.Element => {
    return (
        <html>
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: props.yield }} />
            </body>
        </html>
    );
};

export default Preview;
