import { LoginComponent } from "../../pages/login/login.component";
import { Session } from "../../services/session/schema";
import { Config } from "../aws/config";
/**
 * Subclasses should implement ngOnInit() and call super.ngOnInit() before calling the account to load
 * data.
 */
export var MedvalComponent = (function () {
    function MedvalComponent(tokenProvider, navCtrl, utils) {
        this.tokenProvider = tokenProvider;
        this.navCtrl = navCtrl;
        this.utils = utils;
    }
    MedvalComponent.prototype.ngOnInit = function () {
        if (!Config.isMockData(new Session()) && !this.tokenProvider.getAuthResult()) {
            this.gotoLogin();
        }
    };
    MedvalComponent.prototype.gotoLogin = function () {
        this.utils.setRoot(this.navCtrl, LoginComponent);
    };
    return MedvalComponent;
}());
//# sourceMappingURL=medval.component.js.map