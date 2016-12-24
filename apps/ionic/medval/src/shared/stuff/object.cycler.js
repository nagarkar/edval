import { EventEmitter } from "@angular/core";
/**
 * Created by chinmay on 12/21/16.
 */
export var ObjectCycler = (function () {
    function ObjectCycler(interval) {
        var _this = this;
        var objsToCycle = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            objsToCycle[_i - 1] = arguments[_i];
        }
        this.onNewObj = new EventEmitter();
        this.currentIndex = 0;
        setInterval(function () {
            _this.currentIndex = (_this.currentIndex + 1) % objsToCycle.length;
            _this.onNewObj.emit(objsToCycle[_this.currentIndex]);
        }, interval || 15000 /*http://museumtwo.blogspot.com/2010/10/getting-people-in-door-design-tips-from.html */);
    }
    return ObjectCycler;
}());
//# sourceMappingURL=object.cycler.js.map