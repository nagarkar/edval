import {AbstractService} from "../../shared/service/abstract.service";
import {Session} from "./schema";
import {Config} from "../../shared/aws/config";
import {Utils} from "../../shared/stuff/utils";
import {HttpClient} from "../../shared/stuff/http.client";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Injectable} from "@angular/core";
/**
 * Created by chinmay on 10/31/16.
 */

@Injectable()
export class LiveSessionService extends AbstractService<Session> {

  constructor(
    utils : Utils,
    httpClient: HttpClient,
    accessProvider: AccessTokenService) {

    super(utils, httpClient, accessProvider);
    this.utils.log("Created LiveSessionService: " + typeof this);
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/session";
  }

  getId(member: Session): string {
    return member.sessionId;
  }

}
