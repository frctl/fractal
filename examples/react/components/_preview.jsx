import React from 'react';
import PropTypes from 'prop-types';

const Preview = (props) => {
    return (
        <html>
            <head>
                <meta name="componentName" value={props._target.componentName} />
            </head>
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: props.yield }} />
            </body>
        </html>
    );
};

Preview.propTypes = {
    yield: PropTypes.string,
    _target: PropTypes.shape({
        componentName: PropTypes.string,
    }),
};

export default Preview;
