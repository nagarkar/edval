import { Injectable } from '@angular/core';
import {
  ActionSheetController, AlertController, LoadingController, Alert, ToastController,
  ModalController, Modal, Platform, NavController
} from "ionic-angular";
import {CameraOptions, Camera, SpinnerDialog} from "ionic-native";
import {ErrorType} from "./error.types";

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
  static logs: string[] = []; // capture logs for testing
  static errors: string[] = []; // capture logs for testing

  public static getTime() {
    return Utils.date.getTime();
  }
  public static log(message: string, ...args) : void {
    let fmsg = Utils.format(message, args);
    this.logs.push(fmsg);
    if (console) {
      console.log(fmsg);
    }
  }

  public static error(message: string, ...args) : void {
    let fmsg = Utils.format(message, args);
    this.errors.push(fmsg);
    if (console) {
      console.error(fmsg);
    }
  }

  public static getObjectName(obj: any): string {
    if (obj) {
      return Object.getPrototypeOf(obj).constructor.name;
    }
    return 'undefined';
  }

  public presentProfileModal(component, parameters) : Modal {
    let profileModal : Modal = this.modalCtrl.create(component, parameters);
    profileModal.present(); //profileModal.
    return profileModal;
  }

  public static guid(prefix?: string) {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return (prefix ? prefix: "") + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  public presentTopToast(message: string, delay?: number) {
    let toast = this.toastCtrl.create({
      message: message || 'Success!',
      duration: delay || 3000,
      position: 'top'
    });

    /*
    toast.onDidDismiss(() => {
      this.log('Dismissed toast');
    });
    */
    toast.present();
  }

  public uploadImage() : Promise<string> {
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

  public showLoading(message?: string, delay?: number) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: message || 'Loading...'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, delay || 1000);
  }

  public collectUrl(
    onselect: (result: string | any) => void,
    onerror?: () => void) {

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
          handler: (res) => {
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

  public presentInvalidEntryAlert(message: string, ...args) {
    let alert : Alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: Utils.format(message, args),
      buttons: ['Dismiss']
    });
    alert.present();
  }

  public presentProceedCancelPrompt(
    onselect: (result: string | any) => void,
    subtitle: string
  ) {
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
          handler: data => {
            onselect(data);
          }
        }
      ]
    });
    alert.present();
  }


  public presentAlertPrompt(
    onselect: (result: string | any) => void,
    title?: string,
    inputs?: [{name: string, placeholder:string}]
  ) {
    let alert = this.alertCtrl.create({
      title: title || '',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            onselect(data);
          }
        }
      ]
    });
    alert.present();
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
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.url.startsWith("http://") || data.url.startsWith("https://")) {
              onselect(data.url);
            }
          }
        }
      ]
    });
    alert.present();
  }

  public showLoadingBar() {
    SpinnerDialog.show('Processing', 'Please wait..');
  }

  public hideLoadingBar() {
    SpinnerDialog.hide();
  }

  public isWebView(): boolean {
    if (window && !window.hasOwnProperty('cordova')) {
      return true;
    } else {
      return false;
    }
  }

  public isDesktop() : boolean {
    return this.platform.is("core");
  }

  public isTablet() : boolean {
    return this.platform.is("tablet");
  }

  public isAndroid() : boolean {
    return this.platform.is("android");
  }

  public isIos() : boolean {
    return this.platform.is("ios");
  }

  public forwardAnimation() {
    return {
      animate: true,
      direction: 'forward',
      animation: this.isAndroid()? "md-transition" : "ios-transition",
      duration: 500
    }
  }

  public push(navCtrl: NavController, component: any, params?: any) {
    navCtrl.push(component, params || {}, this.forwardAnimation());
  }

  public setRoot(navCtrl: NavController, component: any, params?: any) {
    navCtrl.setRoot(component, params || {}, this.forwardAnimation());
  }

  public pop(navCtrl: NavController) {
    navCtrl.pop(this.forwardAnimation());
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
  static format(format: string, ...args) {
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };

  private static itemFunction(message: string) {
    return new Function('item', 'return \`' + message + "\`");
  }

  static shuffle<T>(array: Array<T>): Array<T> {
    let length = array.length, t, i;
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

  static throwIfNull(value: any, format?:string, ...args) {
    if (value == null) {
      throw ErrorType.NullNotAllowed(this.format(format, args));
    }
  }

  static throwIfAnyNull(values: any[], format?:string, ...args) {
    values.forEach((value: any)=>{
      if (!value) {
        throw ErrorType.NullNotAllowed(this.format(format || "Null Not Allowed", args));
      }
    })
  }

  public static stringify(obj, replacer?, spaces?, cycleReplacer?) {
    return JSON.stringify(obj, Utils.serializer(replacer, cycleReplacer), spaces)
  }

  private static serializer(replacer, cycleReplacer) {
    var stack = [], keys = []

    if (cycleReplacer == null) cycleReplacer = function (key, value) {
      if (stack[0] === value) return "[Circular ~]"
      return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
    }

    return function (key, value) {
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
