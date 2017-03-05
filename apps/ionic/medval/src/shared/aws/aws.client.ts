/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {AWSLogging} from "./aws.logging";
import {DynamoDB, Suggestion} from "./dynamodb";
import {Session} from "../../services/session/schema";
import {Utils} from "../stuff/utils";

export class AwsClient {

  private static SERVER: AWSLogging;
  private static DDB: DynamoDB;

  static periodicLoggingTimer: number;


  static reInitialize() {
    AwsClient.resetLoggingTimer();
    AwsClient.SERVER = new AWSLogging();
    AwsClient.DDB = new DynamoDB();
  }

  static flushLogs() {
    if (AwsClient.SERVER) {
      AwsClient.SERVER.flush();
    }
  }

  static clearEverything() {
    AwsClient.SERVER = null;
    AwsClient.DDB = null;
  }

  static logEvent(message: string) {
    if (AwsClient.SERVER) {
      try {
        AwsClient.SERVER.logEvent(message);
      } catch(err) {
        Utils.error("Unexpected error {0}; Could not log event {1} to AWS, stack: {2}", err, message, new Error().stack);
      }
    }
  }

  static putSession(session: Session): Promise<Session> {
    if (AwsClient.DDB) {
      return AwsClient.DDB.putSession(session);
    }
    return Promise.resolve(session);
  }

  static putSuggestion(sgg: Suggestion): Promise<Suggestion> {
    if (AwsClient.DDB) {
      return AwsClient.DDB.putSuggestion(sgg);
    }
    return Promise.reject("No DyanmoDB client configured");
  }

  private static resetLoggingTimer() {
    if (AwsClient.periodicLoggingTimer) {
      clearInterval(AwsClient.periodicLoggingTimer);
    }
    AwsClient.periodicLoggingTimer = setInterval(()=> {
      if (AwsClient.SERVER) {
        AwsClient.SERVER.flush();
      }
    }, 5 * 60 * 1000)
  }
}
