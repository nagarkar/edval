/**
 * Created by chinmay on 10/24/16.
 */
export var ErrorType = (function () {
    function ErrorType() {
    }
    ErrorType.UnsupportedOperation = function (operation) {
        return new Error("ErrorType.UnsupportedOperation:" + operation);
    };
    ErrorType.NullNotAllowed = function (message) {
        return new Error("ErrorType.NullNotAllowed:" + message);
    };
    ErrorType.NotLoggedIn = new Error("ErrorType.NotLoggedIn");
    return ErrorType;
}());
//# sourceMappingURL=error.types.js.map