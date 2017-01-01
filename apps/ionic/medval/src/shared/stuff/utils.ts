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
  NavController,
  Loading
} from "ionic-angular";
import {CameraOptions, Camera, SpinnerDialog} from "ionic-native";
import {ErrorType} from "./error.types";
import {Config} from "../config";
import {AWSLogging} from "../aws/aws.logging";

@Injectable()
export class Utils {

  constructor(private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private modalCtrl: ModalController,
              private platform: Platform) {
  }

  static date = new Date();

  static getTime() {
    return Utils.date.getTime();
  }

  static log(message: string, ...args: string[]) : void {
    let fmsg = Utils.format(message, ...args);
    if (console && window['REVVOLVE_PROD_ENV'] == false) {
      console.log(fmsg);
    }
  }

  static error(message: string, ...args: string[]) : void {
    let fmsg = Utils.format(message, ...args);
    if (console) {
      console.error(fmsg);
    }
    if (Utils.SERVER) {
      Utils.SERVER.logEvent(message);
    }
  }

  static logToAws(message: string, ...args: string[]) : void {
    let fmsg = Utils.format(message, ...args);
    if (Utils.SERVER) {
      Utils.SERVER.logEvent(message);
    }
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
  static format(format: string, ...args: string[]) {
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

  static SERVER: AWSLogging;

  private static periodicLoggingTimer = setInterval(()=> {
    if (Utils.SERVER) {
      Utils.SERVER.flush();
    }
  }, 5 * 60 * 1000)

  static throw(format:string, ...args: string[]) {
    throw ErrorType.UnsupportedOperation(this.format(format, ...args));
  }

  static throwIfNull(value: any, format?:string, ...args: string[]) {
    if (value == null) {
      throw ErrorType.NullNotAllowed(this.format(format, ...args));
    }
  }

  static stringify(obj: any, replacer?: (key: string, value: any) => any, space?: string | number, cycleReplacer?: any) {
    return JSON.stringify(obj, Utils.serializer(replacer, cycleReplacer), space)
  }

  static throwIfAnyNull(values: any[], format?:string, ...args: string[]) {
    values.forEach((value: any)=>{
      if (!value) {
        throw ErrorType.NullNotAllowed(this.format(format || "Null Not Allowed", ...args));
      }
    })
  }

  presentProfileModal(component: any, parameters: {}) : Modal {
    let profileModal : Modal = this.modalCtrl.create(component, parameters);
    profileModal.present(); //profileModal.
    return profileModal;
  }

  presentTopToast(message: string, delay?: number) {
    let toast = this.toastCtrl.create({
      message: message || 'Success!',
      duration: delay || 3000,
      position: 'top'
    });
    toast.present();
  }

  presentLoading(duration?: number): Loading {
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      duration: duration || 5000,
      dismissOnPageChange: true
    });
    loading.present();
    return loading;
  }

  uploadImage() : Promise<string> {
    return new Promise((resolve, reject) => {
      let options: CameraOptions = {
        destinationType: 0, //Camera.DestinationType.DATA_URL
        sourceType: 0, //Camera.PictureSourceType.PHOTOLIBRARY
      }
      Camera.getPicture(options)
        .then((imageData) => {
          resolve("data:image/jpeg;base64," + imageData);
        }, (err) => {
          reject(err);
        });
    })
  }

  showLoading(message?: string, delay?: number) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: message || 'Loading...'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, delay || 1000);
  }

  collectUrl(onselect: (result: string | any) => void, onerror?: () => void) {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'PhotoUpload',
      buttons: [
        {
          text: 'Upload',
          icon: 'cloud-upload',
          handler: () => {
            this.showLoadingBar();

            this.uploadImage().then((img: any) => {
              this.hideLoadingBar();
              onselect(img);
            })
          }
        },
        {
          text: 'Image link/url',
          icon: 'attach',
          handler: (res: any) => {
            this.presentURLPrompt(onselect);
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

  presentInvalidEntryAlert(message: string, ...args: string[]) {
    let alert : Alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: Utils.format(message, ...args),
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentProceedCancelPrompt(onselect: (result: string | any) => void, subtitle: string) {
    let alert = this.alertCtrl.create({
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


  presentAlertPrompt(onselect: (result: string | any) => void, title?: string, inputs?: [{name: string, placeholder:string}]) {
    let alert = this.alertCtrl.create({
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
  }

  showLoadingBar() {
    SpinnerDialog.show('Processing', 'Please wait..');
  }

  hideLoadingBar() {
    SpinnerDialog.hide();
  }

  isWebView(): boolean {
    if (window && !window.hasOwnProperty('cordova')) {
      return true;
    } else {
      return false;
    }
  }

  isDesktop() : boolean {
    return this.platform.is("core");
  }

  isTablet() : boolean {
    return this.platform.is("tablet");
  }

  isAndroid() : boolean {
    return this.platform.is("android");
  }

  isIos() : boolean {
    return this.platform.is("ios");
  }

  forwardAnimation(): any {
    if (Config.ANIMATE_PAGE_TRANSITIONS) {
      return {
        animate: true,
        direction: 'forward',
        animation: this.isAndroid() ? "md-transition" : "ios-transition",
        duration: 1000,
        easing: 'ease-in'
      }
    }
    return {
      animate: false
    };
  }

  push(navCtrl: NavController, component: any, params?: any) {
    navCtrl.push(component, params || {}, this.forwardAnimation());
  }

  setRoot(navCtrl: NavController, component: any, params?: any) {
    navCtrl.setRoot(component, params || {}, this.forwardAnimation());
  }

  pop(navCtrl: NavController) {
    navCtrl.pop(this.forwardAnimation());
  }

  private presentURLPrompt(onselect: (result: string | any) => void,) {
    let alert = this.alertCtrl.create({
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
            if (data.url.startsWith("http://") || data.url.startsWith("https://")) {
              onselect(data.url);
            }
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

}
