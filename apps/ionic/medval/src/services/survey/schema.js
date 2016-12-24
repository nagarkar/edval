import { Utils } from "../../shared/stuff/utils";
export var Survey = (function () {
    function Survey() {
    }
    Survey.prototype.toString = function () {
        return Utils.stringify(this);
    };
    Object.defineProperty(Survey.prototype, "displayName", {
        get: function () {
            return [this.properties.name, "(", this.properties.purpose, ")"].join(' ');
        },
        enumerable: true,
        configurable: true
    });
    return Survey;
}());
;
;
//# sourceMappingURL=schema.js.map