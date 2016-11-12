import {ServiceInterface} from "../shared/service/interface.service";
import {MetricService} from "./metric/delegator";
import {StaffService} from "./staff/delegator";
import {AccountService} from "./account/delegator";
import {SessionService} from "./session/delegator";
import {Injectable} from "@angular/core";

@Injectable()
export class ServiceFactory {

  public static SESSION: string = "SESSION";
  public static ACCOUNT: string = "ACCOUNT";
  public static STAFF: string = "STAFF";
  public static METRIC: string = "METRIC";

  private serviceMap: Map<string, ServiceInterface<any>> = new Map<string, ServiceInterface<any>>();

  constructor(
    sessionService: SessionService,
    accountService: AccountService,
    staffService: StaffService,
    metricService: MetricService
  ) {
    this.serviceMap.set(ServiceFactory.SESSION, sessionService);
    this.serviceMap.set(ServiceFactory.ACCOUNT, accountService);
    this.serviceMap.set(ServiceFactory.STAFF, staffService);
    this.serviceMap.set(ServiceFactory.METRIC, metricService);
  }

  get(name: string) {
    return this.serviceMap.get(name);
  }

  resetRegisteredServices() {
    this.serviceMap.forEach((value: ServiceInterface<any>)=>{
      value.reset();
    })
  }
}
