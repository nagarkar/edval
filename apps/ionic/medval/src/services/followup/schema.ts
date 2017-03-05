/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/config";

export class SessionFollowup {

  customerId: string;
  compositeKey: string;
  sessionId : string;
  taskName: string;
  instanceId: string;
  taskState: string;
  entityStatus: string;
  softwareVersion: string = Config.SOFTWARE_VERSION;

  constructor() {}

  toString() {
    return Utils.stringify(this);
  }

  generateSetCompositeKey() {
    this.compositeKey = [this.sessionId, "-", this.taskName, "-", this.instanceId].join("");
  }
}

export class TaskNames {
  // These should be synced with the backend.
  public static EMAIL_REVIEW_REMINDER: string = "Email Review Reminder";
  public static SMS_REVIEW_REMINDER: string = "SMS Review Reminder";
  public static STANDARD_FOLLOWUP: string = "Standard Followup";
  public static TARGETED_FOLLOWUP: string = "Targeted Followup";

}

export class FollowupTaskState {
  static NOT_INITIATED = "NOT_INITIATED";
  static INITIATED = "INITIATED";
  static COMPLETE = "COMPLETE";
}
