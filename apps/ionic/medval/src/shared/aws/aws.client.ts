import {AWSLogging} from "./aws.logging";
import {DynamoDB} from "./dynamodb";
import {Session} from "../../services/session/schema";
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
      AwsClient.SERVER.logEvent(message);
    }
  }

  static putSession(session: Session): Promise<Session> {
    if (AwsClient.DDB) {
      return AwsClient.DDB.putSession(session);
    }
    return Promise.resolve(session);
  }
}
