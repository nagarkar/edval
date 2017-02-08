/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractService} from "../../shared/service/abstract.service";
import {Config} from "../../shared/config";
import {Survey} from "./schema";
import {Http} from "@angular/http";
import {MockSurveyService} from "./mock";

@Injectable()
export class LiveSurveyService extends AbstractService<Survey> {

  constructor(
    http: Http,
    accessProvider: AccessTokenService) {

    super(accessProvider, http, Survey);
  }

  getId(member: Survey): string {
    return member.id;
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/survey";
  }

  validate(surveys: Survey[]): Error[] {
    return MockSurveyService.validateSurveys(surveys);
  }
}
