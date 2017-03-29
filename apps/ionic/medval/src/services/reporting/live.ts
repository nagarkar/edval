/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DailyDataList} from "./schema";
import {AbstractService} from "../../shared/service/abstract.service";
import {Config} from "../../shared/config";

@Injectable()
export class LiveDailyDataService extends AbstractService<DailyDataList>{

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/report";
  }

  getId(member: DailyDataList): string {
    return member.id;
  }

  constructor(http: Http,) {
    super(http, DailyDataList);
  }

}
