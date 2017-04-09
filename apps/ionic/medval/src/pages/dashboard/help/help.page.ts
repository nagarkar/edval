import {Component} from "@angular/core";
import {Config} from "../../../shared/config";
import {Account} from "../../../services/account/schema";
import {Utils} from "../../../shared/stuff/utils";
/**
 * Created by chinmay on 3/7/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

@Component({
  templateUrl: './help.page.html'
})
export class HelpPage{

  get consumerLabel(): string {
    if (this.medicalVertical) {
      return "patient";
    } else {
      //TODO: Change this to 'consumer'
      return "patient";
    }
  }

  get consumerLabelCapitalized(): string {
    return Utils.capitalize(this.consumerLabel);
  }

  get medicalVertical(): boolean {
    return this.getVerticalOrNull() == Account.ORTHODONTIC_CLINIC;
  }

  getVerticalOrNull(): string {
    let account: Account = Config.CUSTOMER;
    if (!account || !account.properties || !account.properties.verticalId) {
      return null;
    }
    return account.properties.verticalId;
  }
}
