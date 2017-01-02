import {ServiceInterface} from "../shared/service/interface.service";
import {Injectable, Injector} from "@angular/core";

declare let REVVOLVE_PROD_ENV: boolean;

/** Annotation to register the component */

export function RegisterService(constructor: Function) {
  ServiceFactory.registerService(constructor);
}


@Injectable()
export class ServiceFactory {

  private static serviceConstructors: Function[] = [];

  private serviceMap: Map<string, ServiceInterface<any>> = new Map<string, ServiceInterface<any>>();

  constructor(private injector: Injector) {
  }

  registerService(instance: ServiceInterface<any>) {
    this.serviceMap.set(instance.constructor.name, instance);
  }

  resetRegisteredServices() {
    if (this.serviceMap.size == 0) {
      ServiceFactory.serviceConstructors.forEach((constructor: Function) => {
        this.serviceMap.set(constructor.name, this.injector.get(constructor));
      });
    }
    this.serviceMap.forEach((value: ServiceInterface<any>)=>{
      if (value) {
        value.reset();
      }
    })
  }

  static registerService(constructor: Function) {
    ServiceFactory.serviceConstructors.push(constructor);
  }
}
