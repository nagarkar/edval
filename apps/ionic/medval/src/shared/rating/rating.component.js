import { Component, Input, Output, EventEmitter, trigger, state, style, transition, animate } from '@angular/core';
import { Utils } from "../stuff/utils";
export var RatingComponent = (function () {
    function RatingComponent(utils) {
        this.utils = utils;
        this.color = 'danger';
        this.onState = 'ion-ios-star ion-android-star';
        this.offState = 'ion-ios-star-outline ion-android-star-outline';
        this._ratingMax = 5;
        this.popped = false;
        this.ratingValueChange = new EventEmitter();
    }
    Object.defineProperty(RatingComponent.prototype, "ratingValue", {
        get: function () {
            return this._ratingValue;
        },
        set: function (value) {
            this._ratingValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RatingComponent.prototype, "ratingMax", {
        get: function () {
            return this._ratingMax;
        },
        set: function (max) {
            this._ratingMax = max;
            this.ratingRange = new Array(max);
            Utils.log("In rating nginit: " + this.ratingRange + ":");
        },
        enumerable: true,
        configurable: true
    });
    RatingComponent.prototype.iconName = function (idx) {
        if (this.state(idx) == 'activePopped' || this.state(idx) == 'activeNormal') {
            return 'star';
        }
        return 'star-outline';
    };
    RatingComponent.prototype.state = function (idx) {
        //return this.popped ? ((idx < this.ratingValue) ? 'activePopped' : 'inactivePopped') : ((idx < this.ratingValue) ? 'activeNormal' : 'inactiveNormal');
        if (this.popped) {
            if (idx < this.ratingValue) {
                return 'activePopped';
            }
            return 'inactivePopped';
        }
        if (!this.popped) {
            if (idx < this.ratingValue) {
                return 'activeNormal';
            }
            return 'inactiveNormal';
        }
    };
    RatingComponent.prototype.setRating = function (value, icon) {
        var _this = this;
        this.ratingValue = value;
        if (value <= (2 * this._ratingMax) / 10) {
            this.color = 'yellow';
        }
        else if (value <= (4 * this._ratingMax) / 10) {
            this.color = 'danger';
        }
        else if (value <= (6 * this._ratingMax) / 11) {
            this.color = 'green';
        }
        else if (value <= (8 * this._ratingMax) / 11) {
            this.color = 'darkgreen';
        }
        else {
            this.color = 'revvolvepurple';
        }
        this.ratingValueChange.emit(value);
        this.popped = true;
        Utils.log("In setRating value:{0}, hasbeenselected:{1}", value.toString(), this.popped.toString());
        setTimeout(function () {
            _this.popped = false;
            Utils.log("Reset hasBeenSelected: {0}", _this.popped.toString());
        }, 1300);
    };
    /*
    public isActiveIcon(idx: number) {
      let ret = (this.popped) && (idx < this.ratingValue);
      if (ret) {
     Utils.log("isActiveIcon value : {0}", ret);
      }
      return ret;
    }
  
    public iconClass(idx: number) {
      let ret = (idx < this.ratingValue) ? "onState" : "offState";
     Utils.log("iconClass value : {0} for index {1}", ret, idx);
      return ret;
    }
  
    public iconStyle(idx: number) {
      return "";//(idx < this.ratingValue) ? "z-index:2" : "display:none";
    }
    */
    RatingComponent.decorators = [
        { type: Component, args: [{
                    selector: 'rating',
                    templateUrl: 'rating.component.html',
                    animations: [
                        trigger('ratingPicked', [
                            state('activePopped', style({
                                transform: 'scale(2)',
                                padding: "0 0 0 0",
                                'z-index': '2',
                                display: 'inline-block'
                            })),
                            state('inactivePopped', style({
                                display: 'none'
                            })),
                            state('activeNormal', style({
                                transform: 'scale(1.2)',
                                display: 'inline-block'
                            })),
                            state('inactiveNormal', style({
                                transform: 'scale(1.2)',
                                display: 'inline-block'
                            })),
                            // http://cubic-bezier.com/#.57,0,.23,.98
                            transition('* => activePopped', animate('300ms cubic-bezier(.89,.39,.84,.5)')),
                            transition('inactivePopped => inactiveNormal', animate('500ms cubic-bezier(.89,.39,.84,.5)'))
                        ])
                    ]
                },] },
    ];
    /** @nocollapse */
    RatingComponent.ctorParameters = [
        { type: Utils, },
    ];
    RatingComponent.propDecorators = {
        'ratingValueChange': [{ type: Output },],
        'ratingValue': [{ type: Input },],
        'ratingMax': [{ type: Input },],
    };
    return RatingComponent;
}());
//# sourceMappingURL=rating.component.js.map