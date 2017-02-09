/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  Alert,
  ToastController,
  ModalController,
  Modal,
  Platform,
  Loading,
  AlertInputOptions, NavController
} from "ionic-angular";
import {CameraOptions, Camera, SpinnerDialog} from "ionic-native";
import {ErrorType} from "./error.types";
import {Config} from "../config";
import {AwsClient} from "../aws/aws.client";
import {CircularList} from "./circular.list";

@Injectable()
export class Utils {


  public static logData: CircularList<string> = new CircularList<string>(Config.LOG_LENGTH);
  public static errData: CircularList<string> = new CircularList<string>(Config.ERR_LENGTH);

  constructor(private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private modalCtrl: ModalController,
              private platform: Platform) {
  }

  static setRoot(navCtrl: NavController, component: Function, params?: any): Promise<any> {
    return navCtrl.setRoot(component, params || {}, Utils.forwardAnimation());
  }

  static push(navCtrl: NavController, component: Function, params?: any): Promise<any> {
    return navCtrl.push(component, {}, params, Utils.forwardAnimation());
  }

  static log(message: string, ...args: any[]) : void {
    let fmsg = Utils.format(message, ...args);
    if (console && window['REVVOLVE_PROD_ENV'] == false) {
      console.log(fmsg);
    }
    try {
      Utils.logData.add(fmsg);
    }catch(err) {console.log('Could not log in logData: ' + err)};
  }

  static errorIf(condition: boolean, message: string, ...args: any[]): void {
    if (condition) {
      Utils.error(message, args);
    }
  }

  static error(message: string, ...args: any[]) : void {
    let fmsg = Utils.format(message, ...args);
    if (console) {
      console.error("Courtsey of Utils.error():" + fmsg);
    }
    AwsClient.logEvent(message);
    try {
      Utils.errData.add(fmsg);
    }catch(err) {console.log('Could not log in errData: ' + err)};
  }

  static assert(object: any) {
    if (object === null) {
      throw new Error("Null object in Utils.assert");
    }
  }

  static assertTrue(object: any) {
    if (!object) {
      throw new Error("Object not evaluated as true in Utils.assertTrue");
    }
  }

  static assertFalse(object: any) {
    if (object) {
      throw new Error("Object not evaluated as false in Utils.assertFalse");
    }
  }

  static getObjectName(obj: any): string {
    if (obj) {
      return Object.getPrototypeOf(obj).constructor.name;
    }
    return 'undefined';
  }

  static guid(prefix?: string) {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return (prefix ? prefix: "") + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  /** @param message, something like "Hello ${item.displayName()}!" */
  static formatTemplate(message: string, item: Map<string, any>): string {
    if (!message || !item) {
      return "";
    }
    const func = Utils.itemFunction(message);
    const result = func(item);
    return result;
  }

  /**
   * http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
   * @param format
   * @returns {string}
   */
  static format(format: string, ...args: any[]) {
    return (new String(format)).replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };

  /** Shuffles the elements of the array using https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle */
  static shuffle<T>(array: Array<T>): Array<T> {
    let length = array.length, t: T, i: number;
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
  }

  static throw(format:string, ...args: string[]) {
    throw ErrorType.UnsupportedOperation(this.format(format, ...args));
  }

  static throwIf(condition: boolean, format: string, ...args: string[]) {
    if (condition) {
      throw ErrorType.UnsupportedOperation(this.format(format, ...args));
    }
  }

  static throwIfNull(value: any, format?:string, ...args: string[]) {
    if (value == null) {
      throw ErrorType.NullNotAllowed(this.format(format, ...args));
    }
  }

  static throwIfNNOU(value: any, format?:string, ...args: string[]) {
    if (Utils.nou(value)) {
      throw ErrorType.NullOrUndefinedNotAllowed(this.format(format, ...args));
    }
  }

  static stringify(
    obj: any, replacer?: (key: string, value: any) => any, space?: string | number, cycleReplacer?: any): string {

    let result = "";
    try {
      result = JSON.stringify(obj, Utils.serializer(replacer, cycleReplacer), space)
    } catch(err) {Utils.error("Error {0} while stringifying object {1} in Utils.stringify", err, obj)}
    return result;
  }

  static throwIfAnyNull(values: any[], format?:string, ...args: string[]) {
    values.forEach((value: any)=>{
      if (!value) {
        throw ErrorType.NullNotAllowed(this.format(format || "Null Not Allowed", ...args));
      }
    })
  }

  static presentProfileModal(modalCtrl: ModalController, component: any, parameters: {}, opts?: {}) : Modal {
    let profileModal : Modal = modalCtrl.create(component, parameters, opts);
    profileModal.present(); //profileModal.
    return profileModal;
  }

  static presentTopToast(toastCtrl: ToastController, message: string, delay?: number) {
    let toast = toastCtrl.create({
      message: message || 'Success!',
      duration: delay || 3000,
      position: 'top'
    });
    toast.present();
  }

  static presentLoading(loadingCtrl: LoadingController, duration?: number): Loading {
    let loading = loadingCtrl.create({
      spinner: 'ios',
      duration: duration || null,
      dismissOnPageChange: true
    });
    loading.present();
    return loading;
  }

  static uploadImage(_options?: CameraOptions) : Promise<string> {
    return new Promise((resolve, reject) => {
      let options: CameraOptions = _options || {
        sourceType: 0, //Camera.PictureSourceType.PHOTOLIBRARY
      };
      options.destinationType = 1; //Camera.DestinationType.FILE_URL
      Camera.getPicture(options)
        .then((imageData) => {
          resolve(imageData);
        }, (err) => {
          reject(err);
        });
    })
  }

  static showLoading(loadingCtrl: LoadingController, message?: string, delay?: number) {
    let loading = loadingCtrl.create({
      spinner: 'hide',
      content: message || 'Loading...'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, delay || 1000);
  }

  static collectUrl(
    alertCtrl: AlertController,
    actionSheetCtrl: ActionSheetController,
    onselect: (result: string | any) => void,
    onerror?: () => void) {

    let actionSheet = actionSheetCtrl.create({
      title: 'PhotoUpload',
      buttons: [
        {
          text: 'Photo Album',
          icon: 'album',
          handler: () => {
            this.uploadImage().then((img: any) => {
              onselect(img);
            })
          }
        },
        {
          text: 'Image link/url',
          icon: 'link',
          handler: (res: any) => {
            Utils.presentURLPrompt(alertCtrl, onselect);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            actionSheet.dismiss();
          }
        }
      ]
    });

    actionSheet.present();
  }

  static presentInvalidEntryAlert(alertCtrl: AlertController, message: string, ...args: string[]): Alert {
    let alert : Alert = alertCtrl.create({
      title: Utils.format(message, ...args),
      buttons: ['Dismiss']
    });
    alert.present();
    return alert;
  }

  static presentProceedCancelPrompt(alertCtrl: AlertController, onselect: (result: string | any) => void, subtitle: string) {
    let alert = alertCtrl.create({
      title: 'Are you sure?',
      subTitle: subtitle,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Proceed',
          handler: (data: any) => {
            onselect(data);
          }
        }
      ]
    });
    alert.present();
  }

  static presentAlertPrompt (
    alertCtrl: AlertController,
    onselect: (result: string | any) => void,
    title?: string, inputs?: Array<AlertInputOptions>): Alert {

    let alert = alertCtrl.create({
      title: title || '',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (data: any) => {
            Utils.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (data: any) => {
            onselect(data);
          }
        }
      ]
    });
    alert.present();
    return alert;
  }

  static showLoadingBar() {
    SpinnerDialog.show('Processing', 'Please wait..');
  }

  static hideLoadingBar() {
    SpinnerDialog.hide();
  }

  static isWebView(): boolean {
    if (window && !window.hasOwnProperty('cordova')) {
      return true;
    } else {
      return false;
    }
  }

  static isDesktop(platform: Platform) : boolean {
    return platform.is("core");
  }

  static isTablet(platform: Platform) : boolean {
    return platform.is("tablet");
  }

  static isAndroid(platform: Platform) : boolean {
    return platform.is("android");
  }

  static isIos(platform: Platform) : boolean {
    return platform.is("ios");
  }

  static forwardAnimation(): any {
    if (Config.ANIMATE_PAGE_TRANSITIONS) {
      return {
        animate: true,
        direction: 'forward',
        duration: 1000,
        easing: 'ease-in'
      }
    }
    return {
      animate: false
    };
  }

  private static presentURLPrompt(alertCtrl, onselect: (result: string | any) => void,) {
    let alert = alertCtrl.create({
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
          handler: (data: any) => {
            Utils.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (data: any) => {
            //if (data.url.startsWith("http://") || data.url.startsWith("https://")) {
              onselect(data.url);
            //}
          }
        }
      ]
    });
    alert.present();
  }

  private static itemFunction(message: string) {
    return new Function('item', 'return \`' + message + "\`");
  }


  private static serializer(replacer: (key: string, value: any) => any, cycleReplacer: any) {
    var stack: any[] = [], keys: any[] = []

    if (cycleReplacer == null) cycleReplacer = function (key: any, value: any) {
      if (stack[0] === value) return "[Circular ~]"
      return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
    }

    return function (key: any, value: any) {
      if (stack.length > 0) {
        var thisPos = stack.indexOf(this)
        ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
        ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
        if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
      }
      else stack.push(value)

      return replacer == null ? value : replacer.call(this, key, value)
    }
  }

  static nou(obj: any): boolean {
    return obj == null || obj == undefined;
  }

  static nullOrEmptyString(obj: string): boolean {
    return obj == null || obj == undefined || (Utils.isString(obj) && obj.length == 0);
  }

  static logAndThrow(err: Error) {
    if (!err) {
      return;
    }
    Utils.error(err.message);
    throw err;
  }

  static unsupportedOperationError(s: string, onObject: Object): Error {
    let err: Error = ErrorType.UnsupportedOperation(s);
    try {
      Utils.error("In {0}, with error: {1}", (onObject ? onObject.constructor.name: 'on unknown object'), err.message)
    } finally {}
    return err;
  }

  static value<T>(value: T, def: T) {
    if (value === null || value === undefined) {
      return def;
    }
    if (typeof value == 'number') {
      let num: number = +value;
      if (isNaN(num)) {
        return def;
      }
    }
    if (Utils.isString(value)) {
      let str = value.toString();
      if (str == "") {
        return def;
      }
    }
    if (typeof value === 'object' && typeof def === 'object' && def !== null) {
      return Object.assign({}, def, value);
    }
    return value;
  }
  static isString(obj: any) {
    return Object.prototype.toString.call(obj) == '[object String]';
  }
}

export declare type ClassType<T> = {
  new (...args: any[]): T;
};
