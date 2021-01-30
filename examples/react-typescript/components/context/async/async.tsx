import React from 'react';

interface AsyncProps {
    xkcd: {
        num: string;
        img: string;
        title: string;
    };
}

const Async = (props: AsyncProps): JSX.Element => {
    return (
        <a href={`https://xkcd.com/${props.xkcd.num}`} target="_blank" rel="nooopener noreferrer">
            <img src={props.xkcd.img} alt={props.xkcd.title} />
        </a>
    );
};

export default Async;
