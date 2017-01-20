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
