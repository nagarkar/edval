import {Injectable, EventEmitter} from '@angular/core';

import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {HttpClient} from "../../shared/stuff/http.client";
import {AbstractService} from "../../shared/service/abstract.service";
import {Config} from "../../shared/aws/config";
import {Survey} from "./schema";
import {Http} from "@angular/http";

@Injectable()
export class LiveSurveyService extends AbstractService<Survey> {

  constructor(
    utils : Utils,
    http: Http,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider, http, new Survey());
    Utils.log("created account account");
  }

  getId(member: Survey): string {
    return member.id;
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/survey";
  }

  reset() {
    super.reset();
    this.list();
  }
}