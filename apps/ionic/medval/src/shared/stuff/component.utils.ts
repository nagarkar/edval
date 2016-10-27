import {ActionSheetController, AlertController} from 'ionic-angular';
import {SpinnerDialog } from 'ionic-native';
import {CameraImageSelector} from "./camera.imageselector";

export class ComponentUtils {

  public static collectUrl(
    actionSheetCtrl: ActionSheetController,
    alertCtrl: AlertController,
    camera: CameraImageSelector,
    onselect: (result: string | any) => void,
    onerror?: () => void) {

    let actionSheet = actionSheetCtrl.create({
      title: 'PhotoUpload',
      buttons: [
        {
          text: 'Upload',
          icon: 'cloud-upload',
          handler: () => {
            ComponentUtils.showLoadingBar();

            camera.uploadImage().then((img: any) => {
              ComponentUtils.hideLoadingBar();
              onselect(img);
            })
          }
        },
        {
          text: 'Image link/url',
          icon: 'attach',
          handler: (res) => {
            this.presentURLPrompt(alertCtrl, onselect);
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

  private static presentURLPrompt(alertCtrl: AlertController, onselect: (result: string | any) => void,) {
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

  public static showLoadingBar() {
    SpinnerDialog.show('Processing', 'Please wait..');
  }

  public static hideLoadingBar() {
    SpinnerDialog.hide();
  }

  public static isWebView(): boolean {
    if (window && !window.hasOwnProperty('cordova')) {
      return true;
    } else {
      return false;
    }
  }
}
