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
