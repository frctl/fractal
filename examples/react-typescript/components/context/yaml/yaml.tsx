import React from 'react';

interface YamlProps {
    text: string;
}

const Yaml = (props: YamlProps): JSX.Element => {
    return <p>{props.text}</p>;
};

export default Yaml;
