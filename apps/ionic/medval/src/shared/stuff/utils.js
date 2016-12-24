import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ToastController, ModalController, Platform } from "ionic-angular";
import { Camera, SpinnerDialog } from "ionic-native";
import { ErrorType } from "./error.types";
export var Utils = (function () {
    function Utils(actionSheetCtrl, alertCtrl, loadingCtrl, toastCtrl, modalCtrl, platform) {
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.modalCtrl = modalCtrl;
        this.platform = platform;
    }
    Utils.getTime = function () {
        return Utils.date.getTime();
    };
    Utils.log = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var fmsg = Utils.format.apply(Utils, [message].concat(args));
        this.logs.push(fmsg);
        if (console) {
            console.log(fmsg);
        }
    };
    Utils.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var fmsg = Utils.format.apply(Utils, [message].concat(args));
        this.errors.push(fmsg);
        if (console) {
            console.error(fmsg);
        }
    };
    Utils.assert = function (object) {
        if (object === null) {
            throw new Error("Null object in Utils.assert");
        }
    };
    Utils.assertTrue = function (object) {
        if (!object) {
            throw new Error("Object not evaluated as true in Utils.assertTrue");
        }
    };
    Utils.assertFalse = function (object) {
        if (object) {
            throw new Error("Object not evaluated as false in Utils.assertFalse");
        }
    };
    Utils.getObjectName = function (obj) {
        if (obj) {
            return Object.getPrototypeOf(obj).constructor.name;
        }
        return 'undefined';
    };
    Utils.prototype.presentProfileModal = function (component, parameters) {
        var profileModal = this.modalCtrl.create(component, parameters);
        profileModal.present(); //profileModal.
        return profileModal;
    };
    Utils.guid = function (prefix) {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return (prefix ? prefix : "") + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    Utils.prototype.presentTopToast = function (message, delay) {
        var toast = this.toastCtrl.create({
            message: message || 'Success!',
            duration: delay || 3000,
            position: 'top'
        });
        toast.present();
    };
    Utils.prototype.presentLoading = function () {
        var loading = this.loadingCtrl.create({
            spinner: 'ios',
            duration: 5000,
            dismissOnPageChange: true
        });
        loading.present();
    };
    Utils.prototype.uploadImage = function () {
        return new Promise(function (resolve, reject) {
            var options = {
                destinationType: 0,
                sourceType: 0,
            };
            Camera.getPicture(options)
                .then(function (imageData) {
                resolve("data:image/jpeg;base64," + imageData);
            }, function (err) {
                reject(err);
            });
        });
    };
    Utils.prototype.showLoading = function (message, delay) {
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: message || 'Loading...'
        });
        loading.present();
        setTimeout(function () {
            loading.dismiss();
        }, delay || 1000);
    };
    Utils.prototype.collectUrl = function (onselect, onerror) {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'PhotoUpload',
            buttons: [
                {
                    text: 'Upload',
                    icon: 'cloud-upload',
                    handler: function () {
                        _this.showLoadingBar();
                        _this.uploadImage().then(function (img) {
                            _this.hideLoadingBar();
                            onselect(img);
                        });
                    }
                },
                {
                    text: 'Image link/url',
                    icon: 'attach',
                    handler: function (res) {
                        _this.presentURLPrompt(onselect);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        actionSheet.dismiss();
                    }
                }
            ]
        });
        actionSheet.present();
    };
    Utils.prototype.presentInvalidEntryAlert = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var alert = this.alertCtrl.create({
            title: 'Are you sure?',
            subTitle: Utils.format.apply(Utils, [message].concat(args)),
            buttons: ['Dismiss']
        });
        alert.present();
    };
    Utils.prototype.presentProceedCancelPrompt = function (onselect, subtitle) {
        var alert = this.alertCtrl.create({
            title: 'Are you sure?',
            subTitle: subtitle,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Proceed',
                    handler: function (data) {
                        onselect(data);
                    }
                }
            ]
        });
        alert.present();
    };
    Utils.prototype.presentAlertPrompt = function (onselect, title, inputs) {
        var alert = this.alertCtrl.create({
            title: title || '',
            inputs: inputs,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: function (data) {
                        onselect(data);
                    }
                }
            ]
        });
        alert.present();
    };
    Utils.prototype.presentURLPrompt = function (onselect) {
        var alert = this.alertCtrl.create({
            title: 'Provide a URL!',
            inputs: [
                {
                    name: 'url',
                    placeholder: 'Type in or copy/paste a url, like: http://somesite.com/yourimage.jpg'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: function (data) {
                        if (data.url.startsWith("http://") || data.url.startsWith("https://")) {
                            onselect(data.url);
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    Utils.prototype.showLoadingBar = function () {
        SpinnerDialog.show('Processing', 'Please wait..');
    };
    Utils.prototype.hideLoadingBar = function () {
        SpinnerDialog.hide();
    };
    Utils.prototype.isWebView = function () {
        if (window && !window.hasOwnProperty('cordova')) {
            return true;
        }
        else {
            return false;
        }
    };
    Utils.prototype.isDesktop = function () {
        return this.platform.is("core");
    };
    Utils.prototype.isTablet = function () {
        return this.platform.is("tablet");
    };
    Utils.prototype.isAndroid = function () {
        return this.platform.is("android");
    };
    Utils.prototype.isIos = function () {
        return this.platform.is("ios");
    };
    Utils.prototype.forwardAnimation = function () {
        return {
            animate: true,
            direction: 'forward',
            animation: this.isAndroid() ? "md-transition" : "ios-transition",
            duration: 1000,
            easing: 'ease-in'
        };
    };
    Utils.prototype.push = function (navCtrl, component, params) {
        navCtrl.push(component, params || {}, this.forwardAnimation());
    };
    Utils.prototype.setRoot = function (navCtrl, component, params) {
        navCtrl.setRoot(component, params || {}, this.forwardAnimation());
    };
    Utils.prototype.pop = function (navCtrl) {
        navCtrl.pop(this.forwardAnimation());
    };
    /** @param message, something like "Hello ${item.displayName()}!" */
    Utils.formatTemplate = function (message, item) {
        if (!message || !item) {
            return "";
        }
        var func = Utils.itemFunction(message);
        var result = func(item);
        return result;
    };
    /**
     * http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
     * @param format
     * @returns {string}
     */
    Utils.format = function (format) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
        });
    };
    ;
    /*
    public static dummyFn() {
      let parser: Parser = new Parser(new Lexer());;
      Utils.log("Parser {0}", parser);
      let obj = {name:'something'};
      Utils.log("Obj {0}", obj);
      let ast: ASTWithSource = parser.parseSimpleBinding("name", "");
      Utils.log("ast {0}", ast);
      let result = ast.visit(new RecursiveAstVisitor(), obj);
      Utils.log("result {0}", result);
    }
    */
    Utils.itemFunction = function (message) {
        return new Function('item', 'return \`' + message + "\`");
    };
    /** Shuffles the elements of the array using https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle */
    Utils.shuffle = function (array) {
        var length = array.length, t, i;
        // While there remain elements to shuffle…
        while (length) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * length--);
            // And swap it with the current element.
            t = array[length];
            array[length] = array[i];
            array[i] = t;
        }
        return array;
    };
    Utils.throw = function (format) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        throw ErrorType.UnsupportedOperation(this.format.apply(this, [format].concat(args)));
    };
    Utils.throwIfNull = function (value, format) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (value == null) {
            throw ErrorType.NullNotAllowed(this.format.apply(this, [format].concat(args)));
        }
    };
    Utils.throwIfAnyNull = function (values, format) {
        var _this = this;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        values.forEach(function (value) {
            if (!value) {
                throw ErrorType.NullNotAllowed(_this.format.apply(_this, [format || "Null Not Allowed"].concat(args)));
            }
        });
    };
    Utils.stringify = function (obj, replacer, space, cycleReplacer) {
        return JSON.stringify(obj, Utils.serializer(replacer, cycleReplacer), space);
    };
    Utils.serializer = function (replacer, cycleReplacer) {
        var stack = [], keys = [];
        if (cycleReplacer == null)
            cycleReplacer = function (key, value) {
                if (stack[0] === value)
                    return "[Circular ~]";
                return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
            };
        return function (key, value) {
            if (stack.length > 0) {
                var thisPos = stack.indexOf(this);
                ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
                ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
                if (~stack.indexOf(value))
                    value = cycleReplacer.call(this, key, value);
            }
            else
                stack.push(value);
            return replacer == null ? value : replacer.call(this, key, value);
        };
    };
    Utils.date = new Date();
    Utils.logs = []; // capture logs for testing
    Utils.errors = []; // capture logs for testing
    Utils.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Utils.ctorParameters = [
        { type: ActionSheetController, },
        { type: AlertController, },
        { type: LoadingController, },
        { type: ToastController, },
        { type: ModalController, },
        { type: Platform, },
    ];
    return Utils;
}());
//# sourceMappingURL=utils.js.map