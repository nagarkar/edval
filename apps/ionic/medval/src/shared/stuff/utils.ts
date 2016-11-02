import { Injectable } from '@angular/core';
import {
  ActionSheetController, AlertController, LoadingController, Alert, ToastController,
  ModalController, Modal, Platform, NavController
} from "ionic-angular";
import {CameraOptions, Camera, SpinnerDialog} from "ionic-native";

@Injectable()
export class Utils {

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private platform: Platform
  )
  { }

  logs: string[] = []; // capture logs for testing
  errors: string[] = []; // capture logs for testing

  public log(message: string, ...args) : void {
    let fmsg = this.format(message, args);
    this.logs.push(fmsg);
    if (console) {
      console.log(fmsg);
    }
  }

  public error(message: string, ...args) : void {
    let fmsg = this.format(message, args);
    this.errors.push(fmsg);
    if (console) {
      console.error(fmsg);
    }
  }

  public presentProfileModal(component, parameters) : Modal {
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

  public presentInvalidEntryAlert(message: string) {
    let alert : Alert = this.alertCtrl.create({
      title: 'Invalid Entry',
      subTitle: message,
      buttons: ['Dismiss']
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

  /**
   * http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
   * @param format
   * @returns {string}
   */
  format(format: string, ...args) {
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };

  /**
   *
   * @param message, something like "Hello ${item.displayName()}!"
   * @param item
   */
  formatTemplate(message: string, item: {displayName: ()=> string}): string {
    const func = this.itemFunction(message);
    const result = func(item);
    this.log("Calculated result:" + result);
    return result;
  }

  private itemFunction(message: string) {
    return new Function('item', 'return \`' + message + "\`");
  }

  public shuffle<T>(array: Array<T>): Array<T> {
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
}
