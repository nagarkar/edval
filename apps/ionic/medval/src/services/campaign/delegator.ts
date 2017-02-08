/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockCampaignService} from "./mock";
import {SurveyService} from "../survey/delegator";
import {MetricService} from "../metric/delegator";
import {RegisterService} from "../service.factory";
import {LiveCampaignService} from "./live";
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
