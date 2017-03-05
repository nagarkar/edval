/**
 * Created by chinmay on 2/12/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Utils} from "../../shared/stuff/utils";

export class GoogleChartsConfig {

  static _CHARTS_LOADED: boolean = undefined;

  static set CHARTS_LOADED(value: boolean) {
    let firstTime: boolean = GoogleChartsConfig._CHARTS_LOADED === undefined;
    Utils.throwIf(!value || !firstTime, "CHARTS_LOADED can only be set to true, and can only be set once");
    GoogleChartsConfig._CHARTS_LOADED = value;
  }

  static get CHARTS_LOADED() {
    return GoogleChartsConfig._CHARTS_LOADED;
  }
}
