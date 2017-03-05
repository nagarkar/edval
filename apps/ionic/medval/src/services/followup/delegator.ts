/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {SessionFollowup} from "./schema";
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockSessionFollowupService} from "./mock";
import {LiveSessionFollowupService} from "./live";
import {RegisterService} from "../service.factory";

@Injectable()
@RegisterService
export class SessionFollowupService extends DelegatingService<SessionFollowup> {

  constructor(
    mockService: MockSessionFollowupService,
    liveService: LiveSessionFollowupService) {

    super(mockService, liveService, SessionFollowup);
  }
}
