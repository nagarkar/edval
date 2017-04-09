/**
 * Created by chinmay on 3/25/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */


import {Account} from "../services/account/schema";
import {DeviceServices} from "../shared/service/DeviceServices";
import {Utils} from "../shared/stuff/utils";

export abstract class AnyComponent {

  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  lightColor: string;
  logo483x106: string;
  logo500x139: string;
  npsBackgroundImage: string;
  iconColor: string;
  buttonTextColor: string;

  placeHolderImage: string = Utils.PLACE_HOLDER_IMAGE_URL;

  constructor() {
    try {
      this.initStyles();
    } catch(err) {
      console.log("Error in AnyComponent: " + err);
    }
  }

  initStyles(useDefaultsOnly?: boolean) {
    this.initColorStyles(useDefaultsOnly);
    this.initImages(useDefaultsOnly);
  }

  initColorStyles(useDefaultsOnly?: boolean) {
    this.primaryColor = Account.getBrandingAttribute('primaryColor', useDefaultsOnly);
    this.secondaryColor = Account.getBrandingAttribute('secondaryColor', useDefaultsOnly);
    this.tertiaryColor = Account.getBrandingAttribute('tertiaryColor', useDefaultsOnly);
    this.lightColor = Account.getBrandingAttribute('lightColor', useDefaultsOnly);
    this.iconColor = Account.getBrandingAttribute('iconColor', useDefaultsOnly);
    this.buttonTextColor = Account.getBrandingAttribute('buttonTextColor', useDefaultsOnly);
  }

  initImages(useDefaultsOnly?: boolean) {
    this.logo483x106 = Account.getBrandingAttribute('logo483x106', useDefaultsOnly);
    this.logo500x139 = Account.getBrandingAttribute('logo500x139', useDefaultsOnly);
    this.npsBackgroundImage = Account.getBrandingAttribute('npsBackgroundImage', useDefaultsOnly);
  }

  revertToDefaultColors() {
    this.initColorStyles(true);
  }

  revertToDefault(attr:string) {
    this[attr]= Account.getBrandingAttribute(attr, true);
  }
}
