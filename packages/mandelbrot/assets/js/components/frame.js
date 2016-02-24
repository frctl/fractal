'use strict';

const $         = global.jQuery;
const split     = require('split.js');

module.exports = function(){

    split(['#sidebar', '#main'], {
        sizes: [25, 75],
        minSize: 200,
        cursor: 'grabbing',
        onDragEnd: function(){
            console.log(Math.round(($('#sidebar').width() / $('body').width()) * 100));
        }
    });

    $('#toggle').on('click', function(){
        $('.fr-wrapper').toggleClass('is-full');
        return false;
    });


  };
