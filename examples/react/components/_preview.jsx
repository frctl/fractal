import React from 'react';
import PropTypes from 'prop-types';

const Preview = (props) => {
    return (
        <html>
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: props.yield }} />
            </body>
        </html>
    );
};

Preview.propTypes = {
    yield: PropTypes.string,
};

export default Preview;
