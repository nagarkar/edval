/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {RegisterService} from "../service.factory";
import {DelegatingService} from "../../shared/service/delegating.service";
import {DailyDataList} from "./schema";
import {LiveDailyDataService} from "./live";
import {MockDailyDataService} from "./mock";


@Injectable()
@RegisterService
export class DailyDataService extends DelegatingService<DailyDataList> {

  constructor(
    mockService: MockDailyDataService,
    liveService: LiveDailyDataService) {

    super(mockService, liveService, DailyDataList);
  }
}
