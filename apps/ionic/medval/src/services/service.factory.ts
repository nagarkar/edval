import {ServiceInterface} from "../shared/service/interface.service";
import {MetricService} from "./metric/delegator";
import {StaffService} from "./staff/delegator";
import {AccountService} from "./account/delegator";
import {SessionService} from "./session/delegator";
import {Injectable} from "@angular/core";
import {Utils} from "../shared/stuff/utils";
import {SurveyService} from "./survey/delegator";

@Injectable()
export class ServiceFactory {

  public static SESSION: string = "SESSION";
  public static ACCOUNT: string = "ACCOUNT";
  public static STAFF: string = "STAFF";
  public static METRIC: string = "METRIC";
  public static SURVEY: string = "SURVEY";

  private serviceMap: Map<string, ServiceInterface<any>> = new Map<string, ServiceInterface<any>>();

  constructor(
    sessionService: SessionService,
    accountService: AccountService,
    staffService: StaffService,
    metricService: MetricService,
    surveyService: SurveyService
  ) {
    this.serviceMap.set(ServiceFactory.SESSION, sessionService);
    this.serviceMap.set(ServiceFactory.ACCOUNT, accountService);
    this.serviceMap.set(ServiceFactory.STAFF, staffService);
    this.serviceMap.set(ServiceFactory.METRIC, metricService);
    this.serviceMap.set(ServiceFactory.SURVEY, surveyService);
  }

  get(name: string): ServiceInterface<any> {
    return this.serviceMap.get(name);
  }

  resetRegisteredServices() {
    Utils.log("Reseting registered services");
    this.serviceMap.forEach((value: ServiceInterface<any>)=>{
      value.reset();
    })
  }
}
