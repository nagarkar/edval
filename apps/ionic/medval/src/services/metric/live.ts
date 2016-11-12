import {AbstractService} from "../../shared/service/abstract.service";
import {Config} from "../../shared/aws/config";
import {Utils} from "../../shared/stuff/utils";
import {HttpClient} from "../../shared/stuff/http.client";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Injectable} from "@angular/core";
import {Metric} from "./schema";
import {Http} from "@angular/http";
/**
 * Created by chinmay on 10/31/16.
 */

@Injectable()
export class LiveMetricService extends AbstractService<Metric> {

  constructor(
    utils : Utils,
    http: Http,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider, http, new Metric());
    Utils.log("Created LiveSessionService: " + typeof this);
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/metric";
  }

  getId(member: Metric): string {
    return member.metricId;
  }

  reset() {
    super.reset();
    this.list();
  }
}
