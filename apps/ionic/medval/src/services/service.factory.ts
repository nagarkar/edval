/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
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

  constructor(private injector: Injector) { }

  registerService(instance: ServiceInterface<any>) {
    this.serviceMap.set(instance.constructor.name, instance);
  }

  resetRegisteredServices(): Promise<any> {
    if (this.serviceMap.size == 0) {
      ServiceFactory.serviceConstructors.forEach((constructor: Function) => {
        this.serviceMap.set(constructor.name, this.injector.get(constructor));
      });
    }
    let promises: Promise<any>[] = [];
    this.serviceMap.forEach((value: ServiceInterface<any>)=>{
      if (value) {
        promises.push(value.reset());
      }
    })
    return Promise.all(promises);
    //this.chartSvc.cache.clear();
  }

  static registerService(constructor: Function) {
    ServiceFactory.serviceConstructors.push(constructor);
  }
}
