import {Injectable} from "@angular/core";
import {RegisterService} from "../../../services/service.factory";
import {Http} from "@angular/http";
import {DailyData, DailyDataList} from "./schema";
import {AbstractService} from "../../../shared/service/abstract.service";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {Config} from "../../../shared/config";

@Injectable()
@RegisterService
export class LiveDailyDataService extends AbstractService<DailyDataList>{

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/report";
  }

  getId(member: DailyDataList): string {
    return member.id;
  }

  constructor(accessProvider: AccessTokenService, http: Http,) {
    super(accessProvider, http, DailyDataList);
  }

}
