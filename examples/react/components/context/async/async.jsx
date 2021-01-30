const React = require('react');
const PropTypes = require('prop-types');

const Async = (props) => {
    return (
        <a href={`https://xkcd.com/${props.xkcd.num}`} target="_blank" rel="nooopener noreferrer">
            <img src={props.xkcd.img} alt={props.xkcd.title} />
        </a>
    );
};

Async.propTypes = {
    xkcd: PropTypes.shape({
        num: PropTypes.string,
        img: PropTypes.string,
        title: PropTypes.string,
    }),
};

module.exports = Async;
