/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {AccessTokenService} from "../aws/access.token.service";
import {EventEmitter} from "@angular/core";
import {HttpClient} from "../stuff/http.client";
import {Utils, ClassType} from "../stuff/utils";
import {ServiceInterface} from "./interface.service";
import {Http} from "@angular/http";
import {Config} from "../config";
import {DeviceServices} from "./DeviceServices";

export abstract class AbstractService<T> implements ServiceInterface<T> {

  // Visible for Testing
  static TEST_MODE: boolean = false;

  private cache: Map<string, T> = new Map<string, T> ();
  private lastCacheClearMillis: number;
  protected httpClient: HttpClient<T>;

  abstract getPath() : string;
  abstract getId(member: T) : string;

  onCreate: EventEmitter<T> = new EventEmitter<T>();
  onUpdate: EventEmitter<T> = new EventEmitter<T>();
  onDelete: EventEmitter<string> = new EventEmitter<string>();

  constructor(http: Http, private clazz: ClassType<T>) {

    this.httpClient = new HttpClient<T>(http, clazz);
  }

  get useCacheOnUpdate(): boolean {
    return true;
  }

  reset(): Promise<any>  {
    this.clearCache();
    return this.list(true /* Dont' use cache (prime the cache) */);
  }

  get(id: string, dontuseCache?: boolean) : Promise<T> {
    Utils.throwIfNull(id);
    if (DeviceServices.isDeviceOffline) {
      DeviceServices.warnAboutNetworkConnection();
      return Promise.reject("No Internet Connection");
    }
    const tryuseCache = !dontuseCache && !Utils.nou(this.lastCacheClearMillis);

    if (tryuseCache) {
      const cachedResult = this.getCached(id);
      if (cachedResult) {
        return Promise.resolve(cachedResult);
      }
    }

    return this.httpClient.get(this.getPath(), id)
      .then((value: T) => {
        this.updateCache(value, this.getPath(), id);
        return value;
      }).catch((err)=> {
        let formatErr = Utils.format("Error: {0}, Stack: {1}", err, new Error().stack);
        Utils.error(formatErr)
        throw err;
      });
  }

  list(dontuseCache?: boolean) : Promise<Array<T>> {
    const tryuseCache = !dontuseCache && !Utils.nou(this.lastCacheClearMillis);

    if (tryuseCache) {
      const cachedResult = this.listCached();
      if (cachedResult) {
        return Promise.resolve(cachedResult);
      }
    }

    if (DeviceServices.isDeviceOffline) {
      DeviceServices.warnAboutNetworkConnection();
      return Promise.reject("No Internet Connection");
    }
    return this.httpClient.list(this.getPath())
      .then((value: Array<T>) => {
        this.clearCache();
        value.forEach((member: T)=>{
          this.updateCache(member, this.getPath(), this.getId(member));
        })
        return value;
      }).catch((err)=> {
        let formattedErr = Utils.format("Error: {0}, Stack: {1}", err, new Error().stack)
        Utils.error(formattedErr);
        throw formattedErr;
      });
  }

  getCached(id: string) : T {
    return this.getCachedValue(this.getPath(), id);
  }

  listCached() : Array<T> {
    return Array.from(this.cache.values());
  }

  create(member: T): Promise<T> {
    Utils.throwIfNull(member);
    if (DeviceServices.isDeviceOffline) {
      DeviceServices.warnAboutNetworkConnection();
      return Promise.reject("No Internet Connection");
    }

    return this.httpClient.post(this.getPath(), member)
      .then((value: T) => {
        this.procesCreatedOrUpdatedValue(value, member);
        this.onCreate.emit(value);
        return value;
      }).catch((err)=> {
        let formattedError = Utils.format("Error: {0}, Stack: {1}", err, new Error().stack)
        return formattedError;
      });
  }

  update(member: T): Promise<T> {
    Utils.throwIfAnyNull([member, this.getId(member)]);

    if (DeviceServices.isDeviceOffline) {
      DeviceServices.warnAboutNetworkConnection();
      return Promise.reject("No Internet Connection");
    }

    return this.httpClient.put(this.getPath(), this.getId(member), member)
      .then((value: T) => {
        this.procesCreatedOrUpdatedValue(value, member);
        this.onUpdate.emit(value);
        return value;
      }).catch((err)=> {
        let formattedErr = Utils.format("Error: {0}, Stack: {1}", err, new Error().stack)
        throw formattedErr;
      });
  }

  delete(id: string): Promise<void> {

    if (DeviceServices.isDeviceOffline) {
      DeviceServices.warnAboutNetworkConnection();
      return Promise.reject("No Internet Connection");
    }
    return this.httpClient.delete(this.getPath(), id)
      .then(() => {
        this.deleteCachedValue(this.getPath(), id);
        this.onDelete.emit(id);
        return;
      }).catch((err)=> {
        let formatErr = Utils.format("Error: {0}, Stack: {1}", err, new Error().stack);
        Utils.error(formatErr);
        throw formatErr;
      });
  }

  /** Override this method to implement validations */
  validate(members: T[]): Error[] {
    return [];
  }

  getInstance(): T {
    return new this.clazz();
  }

  private inMockMode() : boolean {
    return Config.isMockData(this.getInstance());
  }

  private updateCache(value: T, ...pathElements: string[]) {
    if (this.useCacheOnUpdate) {
      this.cache.set(this.getPathFromPathElements(pathElements), value);
    }
  }

  private getCachedValue(...pathElements: string[]) : T {
    if (this.cacheMaxAgeExceeded()) {
      this.clearCache();
      return null;
    }
    return this.cache.get(this.getPathFromPathElements(pathElements));
  }

  clearCache() {
    this.cache.clear();
    this.lastCacheClearMillis = Date.now();
  }

  private deleteCachedValue(...pathElements: string[]) {
    this.cache.delete(this.getPathFromPathElements(pathElements));
  }

  private cacheMaxAgeExceeded() {
    const nowMillis = Date.now();
    return (nowMillis - this.lastCacheClearMillis) > Config.DEFAULT_CACHE_AGE;;
  }

  private getPathFromPathElements(pathElements: string[]) {
    return pathElements.join('/');
  }

  private procesCreatedOrUpdatedValue(value: T, member) {
    if (value === null || value === undefined) {
      Utils.error("Failed to create member {0} at AbstracteService.create, for class {1}",
        member, this.constructor.name);
      return;
    }
    this.updateCache(value, this.getPath(), this.getId(value));
    this.updateCache(value, this.getPath(), this.getId(value));
  }
}
