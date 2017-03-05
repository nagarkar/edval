/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {AbstractService} from "../../shared/service/abstract.service";
import {Config} from "../../shared/config";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Injectable} from "@angular/core";
import {SessionFollowup} from "./schema";
import {Http} from "@angular/http";

@Injectable()
export class LiveSessionFollowupService extends AbstractService<SessionFollowup> {

  constructor(
    http: Http,
    accessProvider: AccessTokenService) {

    super(accessProvider, http, SessionFollowup);
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/followup";
  }

  getId(member: SessionFollowup): string {
    return member.compositeKey;
  }

  setId(member: SessionFollowup, id: string) {
    member.compositeKey = id;
  }
}
