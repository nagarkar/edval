var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Output } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MedvalComponent } from "../stuff/medval.component";
import { AccessTokenService } from "../aws/access.token.service";
import { Utils } from "../stuff/utils";
import { EventEmitter } from "@angular/common/src/facade/async";
export var FeedbackComponent = (function (_super) {
    __extends(FeedbackComponent, _super);
    function FeedbackComponent(tokenProvider, navCtrl, utils) {
        _super.call(this, tokenProvider, navCtrl, utils);
        this.textValue = "";
        this.textValueChange = new EventEmitter();
        //alert("In save feedback const");
    }
    FeedbackComponent.prototype.saveFeedback = function () {
        //alert("In save feedback");
        this.textValueChange.emit(this.textValue);
    };
    FeedbackComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'feedback.component.html',
                    selector: 'textFeedback'
                },] },
    ];
    /** @nocollapse */
    FeedbackComponent.ctorParameters = [
        { type: AccessTokenService, },
        { type: NavController, },
        { type: Utils, },
    ];
    FeedbackComponent.propDecorators = {
        'textValueChange': [{ type: Output },],
    };
    return FeedbackComponent;
}(MedvalComponent));
//# sourceMappingURL=feedback.component.js.map