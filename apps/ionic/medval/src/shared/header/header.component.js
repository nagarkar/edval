import { Component, Input } from "@angular/core";
import { AccountService } from "../../services/account/delegator";
import { NavController } from "ionic-angular";
import { Utils } from "../stuff/utils";
import { Account } from "../../services/account/schema";
import { Config } from "../aws/config";
import { LoginComponent } from "../../pages/login/login.component";
/**
 * Shows the header, including the account logo. If not logged in, logo is not shown.
 */
export var HeaderComponent = (function () {
    function HeaderComponent(accountSvc, navCtrl, utils // instance required for navigation.
        ) {
        this.accountSvc = accountSvc;
        this.navCtrl = navCtrl;
        this.utils = utils;
        this.account = new Account();
        Utils.log("Created header");
    }
    HeaderComponent.prototype.gotoLogin = function () {
        this.utils.setRoot(this.navCtrl, LoginComponent);
    };
    HeaderComponent.prototype.ngOnInit = function () {
        this.getAccount();
    };
    HeaderComponent.prototype.getAccount = function () {
        var _this = this;
        this.accountSvc.get(Config.CUSTOMERID)
            .then(function (account) {
            _this.account = account;
        })
            .catch(function (error) {
            // no op; don't show the image
        });
    };
    HeaderComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'header.component.html',
                    selector: 'mdval-header'
                },] },
    ];
    /** @nocollapse */
    HeaderComponent.ctorParameters = [
        { type: AccountService, },
        { type: NavController, },
        { type: Utils, },
    ];
    HeaderComponent.propDecorators = {
        'title': [{ type: Input },],
        'rightIconName': [{ type: Input },],
    };
    return HeaderComponent;
}());
//# sourceMappingURL=header.component.js.map