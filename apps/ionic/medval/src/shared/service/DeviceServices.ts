import {Subscription} from "rxjs";
import {Utils} from "../stuff/utils";
import {
  Brightness, BatteryStatus, BatteryStatusResponse, CodePush, NativeStorage, Device,
  TextToSpeech, NativeAudio
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
        Utils.log("In brightness observable with plugged: {0}, level: {1}", status.isPlugged, status.level);
        if (status.isPlugged) {
          setBrightnessAndScreenOn(90, true);
          return;
        }
        if (status.level > 90) {
          setBrightnessAndScreenOn(90, true);
        } else if (status.level > 80) {
          setBrightnessAndScreenOn(80, true);
        } else if (status.level > 30) {
          setBrightnessAndScreenOn(70, true);
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

  static preloadSimpleAll(...paths: string[]): Promise<any> {
    if (!paths || !Array.isArray(paths) || paths.length == 0) {
      return Promise.resolve();
    }
    return DeviceServices.preloadSimple(paths[0])
      .then(()=>{
        if (paths.length > 1) {
          return DeviceServices.preloadSimpleAll(...paths.slice(1));
        }
      })
      .catch((err) =>{
        if (paths.length > 1) {
          return DeviceServices.preloadSimpleAll(...paths.slice(1));
        }
      });
  }

  static preloadSimple(path: string): Promise<any> {
    return NativeAudio.preloadSimple(path, path)
      .then(()=>{
        Utils.info("Preloaded sound {0}", path);
      })
      .catch((err) =>{
        Utils.error("Unable to preload sound {0}, due to {1}", path, err);
        throw err;
      });
  }

  static playAll(...ids: string[]): Promise<any> {
    if (!ids || !Array.isArray(ids) || ids.length == 0) {
      return Promise.resolve();
    }
    return NativeAudio.play(
      ids[0],
      ()=>{
        if (ids.length > 1) {
          DeviceServices.playAll(...ids.slice(1));
        }
      })
      .then(()=>{
        Utils.info("Played sound {0}", ids[0]);
      })
      .catch((err)=>{
        Utils.error("Unable to play sound {0}, due to {1}", ids[0], err);
        throw err;
      })
  }

  static play(id: string, nextId?: string): Promise<any> {
    return NativeAudio.play(id, ()=>{} /* Nothing to do on completion */)
      .then(()=>{
        Utils.info("Played sound {0}", id);
      })
      .catch((err)=>{
        Utils.error("Unable to play sound {0}, due to {1}", id, err);
        throw err;
      })
  }

  /*
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
  */
}
