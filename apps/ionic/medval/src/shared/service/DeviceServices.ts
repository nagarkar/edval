import {Subscription} from "rxjs";
import {Utils} from "../stuff/utils";
import {
  Brightness, BatteryStatus, BatteryStatusResponse, CodePush, NativeStorage, Device,
  TextToSpeech
} from "ionic-native";
import {Config} from "../config";
/**
 * Created by chinmay on 3/6/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
export class DeviceServices {

  private static BATTERY_SUBSCRIPTION: Subscription;
  private static INITIAL_INSTALL_TIMESTAMP = "INITIAL_INSTALL_TIMESTAMP";

  static initialize() {
    DeviceServices.setupBatteryCheck();
    DeviceServices.setupCodePush();
    DeviceServices.setupOnPause();
    DeviceServices.storeInitialInstallDate();
  }

  private static setupBatteryCheck() {
    let setBrightnessAndScreenOn = (b: number, o: boolean)=>{
      Utils.info("Setting brightness: {0}, screenon: {1}", b, o);
      Brightness.setBrightness(b);
      Brightness.setKeepScreenOn(o);
    }
    // watch change in battery status
    if (DeviceServices.BATTERY_SUBSCRIPTION) {
      DeviceServices.BATTERY_SUBSCRIPTION.unsubscribe();
    }
    DeviceServices.BATTERY_SUBSCRIPTION = BatteryStatus.onChange().subscribe(
      (status: BatteryStatusResponse) => {
        Utils.log("In brightness observable with plugged: {0}, level: {1}" + status.isPlugged, status.level);
        if (status.isPlugged) {
          setBrightnessAndScreenOn(0.9, true);
          return;
        }
        if (status.level > 0.9) {
          setBrightnessAndScreenOn(0.9, true);
        } else if (status.level > 0.8) {
          setBrightnessAndScreenOn(0.8, true);
        } else if (status.level > 0.3) {
          setBrightnessAndScreenOn(0.7, true);
        } else {
          setBrightnessAndScreenOn(-1, false);
        }
      }
    );
  }

  private static setupCodePush() {
    Utils.log("Setup Code Push");
    CodePush.sync();
  }

  private static setupOnPause() {
    document.addEventListener("pause", ()=>{
      Utils.log("Application Paused");
    }, false);
  }

  private static storeInitialInstallDate() {
    NativeStorage.getItem(DeviceServices.INITIAL_INSTALL_TIMESTAMP)
      .then((timestamp)=>{
        Utils.info("Retrieved {0} for Device {2}: {1}", DeviceServices.INITIAL_INSTALL_TIMESTAMP, timestamp, Device.serial);
        if (!timestamp) {
          let currentTime = new Date().getTime();
          NativeStorage.setItem(DeviceServices.INITIAL_INSTALL_TIMESTAMP, currentTime)
            .then(()=>{
              Utils.info("Stored {0} for device {2}: {1}", DeviceServices.INITIAL_INSTALL_TIMESTAMP, currentTime, Device.serial);
            })
            .catch((err)=>{
              Utils.error("In NativeStorage.setItem(INITIAL_INSTALL_TIMESTAMP) for Device {1}; {0}", Utils.stringify(err), Device.serial);
            })
        }
      })
      .catch((err)=>{
        Utils.error("In NativeStorage.getItem(INITIAL_INSTALL_TIMESTAMP) for Device {1}; {0}", err, Device.serial);
      })
  }

  static speakAll(rate: number, ...messages: string[]): Promise<any>{
    if (!messages) {
      return Promise.resolve();
    }
    return DeviceServices.speak(messages[0], rate)
      .then(()=>{
        if (messages.length > 1) {
          return DeviceServices.speakAll(rate, ...messages.slice(1));
        }
      })
      .catch((err) =>{
        if (messages.length > 1) {
          return DeviceServices.speakAll(rate, ...messages.slice(1));
        }
      });
  }

  static speak(message: string, rate: number): Promise<any> {
    if (!Config.ENABLE_TTS) {
      return Promise.resolve();
    }
    return TextToSpeech.speak({text: message, locale: Config.LOCALE, rate:rate})
      .then((val: any) => {
        Utils.log('Successfully spoke this message: {0}', message);
        return val;
      })
      .catch((reason: any) => {
        Utils.log('Failed to speak message: {0}', message);
        throw reason;
      });
  }
}
