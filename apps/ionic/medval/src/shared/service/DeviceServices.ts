import {Subscription} from "rxjs";
import {Utils} from "../stuff/utils";
import {
  Brightness,
  BatteryStatus,
  BatteryStatusResponse,
  CodePush,
  NativeStorage,
  Device,
  NativeAudio,
  Network,
  Dialogs
} from "ionic-native";
import {HelpMessages} from "../stuff/HelpMessages";
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
  private static NETWORK_CONNECTED = false;
  public static NO_CONNECTION_ID = 'none';


  static initialize() {
    DeviceServices.setupBatteryCheck();
    DeviceServices.setupCodePush();
    DeviceServices.setupOnPause();
    DeviceServices.storeInitialInstallDate();
    DeviceServices.trackNetworkConnection();
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
        } else if (status.level > 15) {
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

  static setItem(id: string, value: any): Promise<any> {
    return NativeStorage.setItem(id, value);
  }

  static getItem(id: string): Promise<any> {
    return NativeStorage.getItem(id)
      .then((value: any)=>{
        Utils.info("Retrieved value {0} from native storage, for id: {1}", value, id);
        return value;
      })
      .catch((err)=>{
        if (err.code == 2) { // item Not found
          return null;
        }
        throw err;
      });
  }

  private static storeInitialInstallDate() {
    DeviceServices.getItem(DeviceServices.INITIAL_INSTALL_TIMESTAMP)
      .then((timestamp: any)=>{
        if (!timestamp) {
          let currentTime = new Date().getTime();
          return DeviceServices.setItem(DeviceServices.INITIAL_INSTALL_TIMESTAMP, currentTime)
            .then(()=>{
              Utils.error("New Device Install at timestamp: {0} for device {1}", currentTime, Device.serial);
            })
            .catch((err)=>{
              Utils.error("In NativeStorage.setItem(INITIAL_INSTALL_TIMESTAMP) for Device {1}; err.code: {0}, err.exception:{2}", err.code, Device.serial, err.exception);
            })
            ;
        }
      })
      .catch((err)=> {
        Utils.error("In NativeStorage.getItem(INITIAL_INSTALL_TIMESTAMP) for Device {1}; err.code: {0}, err.exception:{2}", err.code, Device.serial, err.exception);
      });
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

  private static trackNetworkConnection() {
    // watch network for a disconnect
    Network.onDisconnect().subscribe(() => {
      DeviceServices.NETWORK_CONNECTED = false;
      Utils.log('network was disconnected :-(');
      DeviceServices.warnAboutNetworkConnection();
    });
    Network.onConnect().subscribe(() => {
      DeviceServices.NETWORK_CONNECTED = true;
      Utils.log('Network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type.  Might need to wait
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (Network.type === 'wifi') {
          Utils.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
    if (Network.type == DeviceServices.NO_CONNECTION_ID) {
      DeviceServices.NETWORK_CONNECTED = false;
    } else {
      DeviceServices.NETWORK_CONNECTED = true;
    }
  }

  static get isDeviceOnline(): boolean {
    return DeviceServices.NETWORK_CONNECTED;
  }

  static get isDeviceOffline(): boolean {
    return !DeviceServices.isDeviceOnline;
  }

  static warnAboutNetworkConnection() {
    if (!DeviceServices.isDeviceOnline) {
      let titleAndMessage: any = HelpMessages.getMessageFor("NO_NETWORK");
      Dialogs.alert(titleAndMessage.message, titleAndMessage.title);
    }
  }
}
