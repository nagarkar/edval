/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {AbstractService} from "../../shared/service/abstract.service";
import {Session} from "./schema";
import {Config} from "../../shared/config";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
/**
 * Created by chinmay on 10/31/16.
 */

@Injectable()
export class LiveSessionService extends AbstractService<Session> {

  constructor(
    http: Http,
    accessProvider: AccessTokenService) {

    super(accessProvider, http, Session);
    Utils.log("Created LiveSessionService: " + typeof this);
  }

  getId(member: Session): string {
    return member.sessionId;
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/session";
  }

  /** Override default so we don't list all sessions on startup */
  reset(): void {
    this.clearCache();
  }

  /** Don't update cache */
  get useCacheOnUpdate(): boolean {
    return false;
  }
}
