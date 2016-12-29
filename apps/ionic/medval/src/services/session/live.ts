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
    utils : Utils,
    http: Http,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider, http, new Session());
    Utils.log("Created LiveSessionService: " + typeof this);
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/session";
  }

  getId(member: Session): string {
    return member.sessionId;
  }
}
