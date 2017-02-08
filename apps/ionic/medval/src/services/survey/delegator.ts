/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {MockSurveyService} from "./mock";
import {Survey} from "./schema";
import {LiveSurveyService} from "./live";
import {DelegatingService} from "../../shared/service/delegating.service";
import {RegisterService} from "../service.factory";

@Injectable()
@RegisterService
export class SurveyService extends DelegatingService<Survey> {
  constructor(
    mockService: MockSurveyService,
    liveService: LiveSurveyService) {

    super(mockService, liveService);
  }
}
