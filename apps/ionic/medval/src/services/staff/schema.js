import { Config } from "../../shared/aws/config";
import { Utils } from "../../shared/stuff/utils";
export var Staff = (function () {
    function Staff() {
        this.properties = this.properties || { title: "Dr." };
    }
    Staff.prototype.toString = function () {
        return Utils.stringify(this);
    };
    Object.defineProperty(Staff.prototype, "displayName", {
        get: function () {
            return [this.properties.title, this.properties.firstName, this.properties.lastName].join(' ');
        },
        enumerable: true,
        configurable: true
    });
    Staff.getUsernames = function (staffSet) {
        var usernames = [];
        staffSet.forEach(function (value) {
            usernames.push(value.username);
        });
        return usernames;
    };
    Staff.newStaffMember = function () {
        return Object.assign(new Staff(), {
            customerId: Config.CUSTOMERID,
            username: "",
            entityStatus: "",
            role: "",
            properties: {
                firstName: "",
                lastName: "",
                email: "",
                photoUrl: ""
            }
        });
    };
    return Staff;
}());
;
//# sourceMappingURL=schema.js.map