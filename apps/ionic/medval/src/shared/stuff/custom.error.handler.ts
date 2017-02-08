/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {IonicErrorHandler} from "ionic-angular";
import {AwsClient} from "../aws/aws.client";

export class CustomErrorHandler extends IonicErrorHandler {

  constructor() {
    super();
  }

  handleError(err: any): void {
    super.handleError(err);
    try {
      AwsClient.logEvent(err);
    } catch(err) {
      console.error(err);
    }
  }
}
