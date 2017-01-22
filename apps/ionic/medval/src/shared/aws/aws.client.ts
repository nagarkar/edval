import {AWSLogging} from "./aws.logging";
import {DynamoDB} from "./dynamodb";
import {Session} from "../../services/session/schema";
import {Utils} from "../stuff/utils";
export class AwsClient {

  private static SERVER: AWSLogging;
  private static DDB: DynamoDB;

  static periodicLoggingTimer = setInterval(()=> {
    if (AwsClient.SERVER) {
      AwsClient.SERVER.flush();
    }
  }, 5 * 60 * 1000)


  static reInitialize() {
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
        Utils.log("Unexpected error {0}; Could not log event {1} to AWS, stack: {2}", err, message, new Error().stack);
      }
    }
  }

  static putSession(session: Session): Promise<Session> {
    if (AwsClient.DDB) {
      return AwsClient.DDB.putSession(session);
    }
    return Promise.resolve(session);
  }
}
