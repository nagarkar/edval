/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {AbstractService} from "../../shared/service/abstract.service";
import {Config} from "../../shared/config";
import {Injectable} from "@angular/core";
import {Metric} from "./schema";
import {Http} from "@angular/http";

@Injectable()
export class LiveMetricService extends AbstractService<Metric> {

  constructor(http: Http) {

    super(http, Metric);
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/metric";
  }

  getId(member: Metric): string {
    return member.metricId;
  }
}
