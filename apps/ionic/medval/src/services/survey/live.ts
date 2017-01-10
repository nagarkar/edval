import {Injectable} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractService} from "../../shared/service/abstract.service";
import {Config} from "../../shared/config";
import {Survey} from "./schema";
import {Http} from "@angular/http";
import {MockSurveyService} from "./mock";

@Injectable()
export class LiveSurveyService extends AbstractService<Survey> {

  constructor(
    utils : Utils,
    http: Http,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider, http, Survey);
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

  reset() {
    super.reset();
    this.list();
  }
}
