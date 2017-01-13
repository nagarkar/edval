import {AccessTokenService} from "../aws/access.token.service";
import {ErrorType} from "../stuff/error.types";
import {EventEmitter} from "@angular/core";
import {HttpClient} from "../stuff/http.client";
import {Utils, ClassType} from "../stuff/utils";
import {ServiceInterface} from "./interface.service";
import {Http} from "@angular/http";
import {Config} from "../config";

export abstract class AbstractService<T> implements ServiceInterface<T> {

  private static DEFAULT_CACHE_AGE = 10 * 60 * 1000; // 10 minutes.

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

  constructor(
    protected utils : Utils,
    protected accessProvider: AccessTokenService,
    http: Http,
    private clazz: ClassType<T>) {

    this.httpClient = new HttpClient<T>(accessProvider, http, clazz);
  }

  reset(): void {
    this.clearCache();
    this.list(true /* Dont' use cache (prime the cache) */);
  }

  get(id: string, dontuseCache?: boolean) : Promise<T> {
    this.checkGate();
    Utils.throwIfNull(id);
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
      }).catch((err)=> Utils.error(err));
  }

  list(dontuseCache?: boolean) : Promise<Array<T>> {
    this.checkGate();

    const tryuseCache = !dontuseCache && !Utils.nou(this.lastCacheClearMillis);

    if (tryuseCache) {
      const cachedResult = this.listCached();
      if (cachedResult) {
        return Promise.resolve(cachedResult);
      }
    }

    return this.httpClient.list(this.getPath())
      .then((value: Array<T>) => {
        this.clearCache();
        value.forEach((member: T)=>{
          this.updateCache(member, this.getPath(), this.getId(member));
        })
        return value;
      }).catch((err)=> Utils.error(err));
  }

  getCached(id: string) : T {
    return this.getCachedValue(this.getPath(), id);
  }

  listCached() : Array<T> {
    return Array.from(this.cache.values());
  }

  create(member: T): Promise<T> {
    this.checkGate();
    Utils.throwIfNull(member);

    return this.httpClient.post(this.getPath(), member)
      .then((value: T) => {
        if (value === null || value === undefined) {
          Utils.error("Failed to create member {0} at AbstracteService.create, for class {1}",
            member, this.constructor.name);
          return;
        }
        this.updateCache(value, this.getPath(), this.getId(value));
        this.onCreate.emit(value);
        return value;
      }).catch((err)=> Utils.error(err));
  }

  update(member: T): Promise<T> {
    this.checkGate();
    Utils.throwIfAnyNull([member, this.getId(member)]);

    return this.httpClient.put(this.getPath(), this.getId(member), member)
      .then((value: T) => {
        this.updateCache(value, this.getPath(), this.getId(value));
        this.onUpdate.emit(value);
        return value;
      }).catch((err)=> Utils.error(err));
  }

  delete(id: string): Promise<void> {
    this.checkGate();

    return this.httpClient.delete(this.getPath(), id)
        .then(() => {
          this.deleteCachedValue(this.getPath(), id);
          this.onDelete.emit(id);
          return Promise.resolve();
        }).catch((err)=> Utils.error(err));
  }

  /** Override this method to implement validations */
  validate(members: T[]): Error[] {
    return [];
  }

  getInstance(): T {
    return new this.clazz();
  }

  protected checkGate() : void {
    if (!AbstractService.TEST_MODE && !this.inMockMode() && !this.accessProvider.supposedToBeLoggedIn()) {
      ErrorType.throwNotLoggedIn();
    }
  }

  private inMockMode() : boolean {
    return Config.isMockData(this.getInstance());
  }

  private updateCache(value: T, ...pathElements: string[]) {
    this.cache.set(this.getPathFromPathElements(pathElements), value);
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
    return (nowMillis - this.lastCacheClearMillis) > AbstractService.DEFAULT_CACHE_AGE;;
  }

  private getPathFromPathElements(pathElements: string[]) {
    return pathElements.join('/');
  }
}
