const React = require('react');

const Async = () => {
    return (
        <a href="https://xkcd.com/{{ xkcd.num }}" target="_blank" rel="nooopener noreferrer">
            <img src="{{ xkcd.img }}" alt="{{ xkcd.title }}" />
        </a>
    );
};

module.exports = Async;
