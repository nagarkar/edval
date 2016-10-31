import { Injectable } from '@angular/core';
import {
  ActionSheetController, AlertController, LoadingController, Alert, ToastController,
  ModalController, Modal, Platform
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

  public log(message: string) : void {
    this.logs.push(message);
    if (console) {
      console.log(message);
    }
  }

  public error(message: string) : void {
    this.errors.push(message);
    if (console) {
      console.error(message);
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

    toast.onDidDismiss(() => {
      this.log('Dismissed toast');
    });

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
}
