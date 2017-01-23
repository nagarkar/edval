import {Config} from "../config";
import {Session} from "../../services/session/schema";
import {Utils} from "../stuff/utils";
declare let AWS:any;

export class DynamoDB {

  private dynamodb: any;

  constructor() {

    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      credentials: AWS.config.credentials,
      region: Config.AWS_CONFIG.REGION
    });
  }

  putSession(item: Session): Promise<Session> {
    let params = {
      TableName: "SESSION_CLIENT_DATA",
      Item: {
        customer_id: Config.CUSTOMERID,
        id: item.sessionId,
        properties: item.properties
      }
    }
    return new Promise((resolve, reject) => {
      this.dynamodb.put(params, function(err, data) {
        if (err) {
          Utils.error("Unable to add session", item.sessionId, ". Error JSON:", err, null, 2);
          reject(err);
        } else {
          Utils.log("PutItem succeeded:", item.sessionId);
          resolve(err);
        }
      });
    })
  }
}
