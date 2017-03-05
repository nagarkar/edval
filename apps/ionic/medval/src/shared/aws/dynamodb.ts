/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
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

  putSuggestion(item: Suggestion): Promise<Suggestion> {
    let params = {
      TableName: "SUGGESTIONS",
      Item: {
        customerId: Config.CUSTOMERID,
        id: item.id,
        suggestion: item.suggestion,
        contactMethod: item.contactMethod
      }
    }
    return new Promise((resolve, reject) => {
      this.dynamodb.put(params, function(err, data) {
        if (err) {
          Utils.error("Unable to add suggestion", item.id, ". Error JSON:", err, null, 2);
          reject(err);
        } else {
          Utils.info("Added Suggestion:", item.id);
          resolve(err);
        }
      });
    })
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
          Utils.info("PutItem succeeded:", item.sessionId);
          resolve(err);
        }
      });
    })
  }
}

export class Suggestion {
  customerId: string;
  id: string;
  suggestion: string;
  contactMethod: string;

  constructor() {
    this.customerId = Config.CUSTOMERID;
    this.id = "" + new Date().getTime();
  }
}
