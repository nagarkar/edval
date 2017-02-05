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
