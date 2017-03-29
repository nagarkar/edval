/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Session} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {Injectable, EventEmitter} from "@angular/core";
import {ServiceInterface} from "../../shared/service/interface.service";
import {AwsClient} from "../../shared/aws/aws.client";
/**
 * Created by chinmay on 10/31/16.
 */

@Injectable()
export class DDBSessionService implements ServiceInterface<Session> {

  onCreate: EventEmitter<Session> = new EventEmitter<Session>();
  onUpdate: EventEmitter<Session> = new EventEmitter<Session>();
  onDelete: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  getId(member: Session): string {
    return member.sessionId;
  }

  get(id: string, dontuseCache?: boolean): Promise<Session> {
    throw Utils.unsupportedOperationError("get not supported for sessions", this);
  }

  list(dontuseCache?: boolean): Promise<Array<Session>> {
    throw Utils.unsupportedOperationError("list not supported for sessions", this);
  }

  clearCache() {
    throw Utils.unsupportedOperationError("caching not supported for sessions", this);
  }

  getCached(id: string): Session {
    throw Utils.unsupportedOperationError("get not supported for sessions", this);
  }

  listCached(): Array<Session> {
    throw Utils.unsupportedOperationError("list not supported for sessions",this);
  }

  update(session: Session): Promise<Session> {
    return AwsClient.putSession(session);
  }

  create(session: Session): Promise<Session> {
    return AwsClient.putSession(session);
  }

  delete(id: string): Promise<void> {
    return Promise.reject("delete not supported for sessions");
  }

  reset(): Promise<any>  { return Promise.resolve() }

  validate(members: Session[]): Error[] {
    return [];
  }
}
