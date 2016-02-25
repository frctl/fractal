'use strict';

const $       = global.jQuery;
const storage = require('../storage');

module.exports = function(element){

    const el         = $(element);
    const id         = element[0].id;
    const panels     = el.children('.Frame-panel');
    const gutter     = el.children('.Frame-gutter').eq(0);
    const gutterSize = 10;

    if (panels.length > 2) {
        throw new Error('Only two panels are supported!');
    }

    const left  = panels.eq(0);
    const right = panels.eq(1);

    let start      = 0;
    let startPos   = null;
    let isDragging = false;
    let docWidth   = null;

    // this._state = storage.get(`splitframe.${this._id}.state`, $.map(this._panels, p => $(p).attr('data-size')));

    let move = function(e){
        let leftPercentageWidth  = ((startPos + (e.pageX - start)) / docWidth) * 100;
        leftPercentageWidth      = (leftPercentageWidth > 100) ? 100 : leftPercentageWidth;
        leftPercentageWidth      = (leftPercentageWidth < 0) ? 0 : leftPercentageWidth;
        let rightPercentageWidth = 100 - leftPercentageWidth;
        left.css('width', `calc(${leftPercentageWidth}% - ${gutterSize / 2}px)`);
        right.css('width', `calc(${rightPercentageWidth}% - ${gutterSize / 2}px)`)
    };
    move = move.bind(this);

    let startDrag = function(e){
        if (isDragging) return;
        start      = e.pageX;
        isDragging = true;
        docWidth   = $(document).width();
        startPos   = left.width();
        $(window).on('mousemove', move);
    };
    startDrag = startDrag.bind(this);

    let stopDrag = function(){
        if (!isDragging) return;
        $(window).off('mousemove');
        start      = null;
        startPos   = null;
        isDragging = false;
    };
    stopDrag = stopDrag.bind(this);

    gutter.on('mousedown', startDrag);
    $(window).on('mouseup', stopDrag);

    gutter.css('width', gutterSize + 'px');
};

// updateState() {
//     const docWidth = $( document ).width();
//     const state = [];
//     const gutterAddition = this._gutterSize / this._panels.length;
//     for (let panel of this._panels) {
//         state.push((($(panel).width() + gutterAddition) / docWidth) * 100);
//     }
//     this._state = state;
//     storage.set(`splitframe.${this._id}.state`, this._state);
// }
