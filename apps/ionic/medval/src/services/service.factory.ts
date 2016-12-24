import {ServiceInterface} from "../shared/service/interface.service";
import {Injectable, Injector} from "@angular/core";
import {Utils} from "../shared/stuff/utils";

declare let REVVOLVE_PROD_ENV: boolean;

/** Annotation to register the component */

export function RegisterService(constructor: Function) {
  ServiceFactory.registerService(constructor);
}


@Injectable()
export class ServiceFactory {

  private static serviceConstructors: Function[] = [];

  private serviceMap: Map<string, ServiceInterface<any>> = new Map<string, ServiceInterface<any>>();

  public ServiceFactory(injector: Injector) {
    ServiceFactory.serviceConstructors.forEach((constructor: Function)=>{
      this.serviceMap.set(constructor.name, injector.get(constructor));
    })
  }

  registerService(instance: ServiceInterface<any>) {
    this.serviceMap.set(instance.constructor.name, instance);
  }

  resetRegisteredServices() {
    Utils.log("Reseting registered services");
    this.serviceMap.forEach((value: ServiceInterface<any>)=>{
      value.reset();
    })
  }

  static registerService(constructor: Function) {
    ServiceFactory.serviceConstructors.push(constructor);
  }
}
