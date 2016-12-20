import {AccessTokenService} from "../aws/access.token.service";
import {ErrorType} from "../stuff/error.types";
import {EventEmitter} from "@angular/core";
import {HttpClient} from "../stuff/http.client";
import {Utils} from "../stuff/utils";
import {ServiceInterface} from "./interface.service";
import {Http} from "@angular/http";
import {Config} from "../aws/config";


export abstract class AbstractService<T> implements ServiceInterface<T> {

  private static DEFAULT_CACHE_AGE = 10*60*1000; // 10 minutes.
  private timeKeeper: Date = new Date();
  private cache: Map<string, T | Array<T>> = new Map<string, T | Array<T>> ();
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
    private instance: T) {

    this.httpClient = new HttpClient(utils, accessProvider, http, instance);
    this.lastCacheClearMillis = this.timeKeeper.getMilliseconds();
  }

  /**
   * Override this to make the cache last longer or shorter periods.
   * @returns {number} The number of milliseconds after which cache should be eliminated.
   */
  protected maxCacheAge(): number {
    return AbstractService.DEFAULT_CACHE_AGE;
  }

  reset() {
    this.cache.clear();
  }

  get(id: string, dontuseCache?: boolean) : Promise<T> {
    this.checkGate();
    Utils.throwIfNull(id);
    const tryuseCache = !dontuseCache;

    if (tryuseCache) {
      const cachedResult = this.getCached(id);
      if (cachedResult) {
        return Promise.resolve(cachedResult);
      }
    }

    return this.httpClient.get(this.getPath(), id)
      .then((value: Array<T>) => {
        this.updateCache(value, this.getPath(), id);
        return value;
      });
  }

  list(dontuseCache?: boolean) : Promise<Array<T>> {
    this.checkGate();

    const tryuseCache = !dontuseCache;

    if (tryuseCache) {
      const cachedResult = this.listCached();
      if (cachedResult) {
        return Promise.resolve(cachedResult);
      }
    }

    return this.httpClient.list(this.getPath())
      .then((value: Array<T>) => {
        this.updateCache(value, this.getPath());
        return value;
      });
  }

  getCached(id: string) : T {
    return this.getCachedValue(this.getPath(), id) as T;
  }

  listCached() : Array<T> {
    return this.getCachedValue(this.getPath()) as Array<T>;
  }

  create(member: T): Promise<T> {
    this.checkGate();
    Utils.throwIfNull(member);

    return this.httpClient.post(this.getPath(), member)
      .then((value: T) => {
        this.updateCache(value, this.getPath(), this.getId(value));
        this.deleteCachedValue(this.getPath());
        this.onCreate.emit(value);
        return value;
      });
  }

  update(member: T): Promise<T> {
    this.checkGate();
    Utils.throwIfAnyNull([member, this.getId(member)]);

    return this.httpClient.put(this.getPath(), this.getId(member), member)
        .then((value: T) => {
          this.updateCache(value, this.getPath(), this.getId(value));
          this.deleteCachedValue(this.getPath());
          this.onUpdate.emit(value);
          return value;
      });
  }

  delete(id: string): Promise<boolean> {
    this.checkGate();

    return this.httpClient.delete(this.getPath(), id)
        .then(() => {
          this.deleteCachedValue(this.getPath(), id);
          this.deleteCachedValue(this.getPath());
          this.onDelete.emit(id);
          return true;
        });
  }

  public getInstance(): T {
    return this.instance;
  }

  protected checkGate() : void {
    if (!this.inMockMode() && !this.accessProvider.supposedToBeLoggedIn()) {
      throw ErrorType.NotLoggedIn;
    }
  }

  private inMockMode() : boolean {
    return Config.isMockData(this.getInstance());
  }

  private updateCache(value: T | Array<T>, ...pathElements) {
    this.cache.set(pathElements.join(), value);
  }

  private getCachedValue(...pathElements) : T | Array<T> {
    if (this.cacheMaxAgeExceeded()) {
      this.clearCache();
      return null;
    }
    return this.cache.get(pathElements.join());
  }

  private clearCache() {
    this.cache.clear();
    this.lastCacheClearMillis = this.timeKeeper.getMilliseconds();
  }

  private deleteCachedValue(...pathElements) {
    this.cache.delete(pathElements.join());
  }

  private cacheMaxAgeExceeded() {
    const nowMillis = this.timeKeeper.getMilliseconds();
    return (nowMillis - this.lastCacheClearMillis) > this.maxCacheAge();
  }
}
