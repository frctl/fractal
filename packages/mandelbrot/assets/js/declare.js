'use strict';


class Declare {

    constructor(el){
        this._el = $(el);
        this._dom = {};
        this._el.find('[data-role]:not([data-behaviour] [data-role])').forEach(el => {
            
        });
    }

}
