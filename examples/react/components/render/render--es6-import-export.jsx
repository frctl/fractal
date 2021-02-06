import React from 'react';
import PropTypes from 'prop-types';

const RenderES6ImportExport = (props) => {
    return <>Render {props.something}</>;
};

RenderES6ImportExport.propTypes = {
    something: PropTypes.string,
};

export default RenderES6ImportExport;
