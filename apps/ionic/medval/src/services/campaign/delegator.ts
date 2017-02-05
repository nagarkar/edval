import {Injectable} from "@angular/core";
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockCampaignService} from "./mock";
import {Utils} from "../../shared/stuff/utils";
import {SurveyNavigator} from "../survey/survey.navigator";
import {SurveyService} from "../survey/delegator";
import {MetricService} from "../metric/delegator";
import {RegisterService} from "../service.factory";
import {LiveCampaignService} from "./live";
import {Config} from "../../shared/config";
import {Campaign} from "./schema";

@Injectable()
@RegisterService
export class CampaignService extends DelegatingService<Campaign> {

  constructor(
    mockService: MockCampaignService,
    liveService: LiveCampaignService,
    private surveyService: SurveyService,
    private metricSvc: MetricService) {

    super(mockService, liveService, Campaign);
  }

}
