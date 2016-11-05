import {AccessTokenService} from "../aws/access.token.service";
import {ErrorType} from "../stuff/error.types";
import {EventEmitter} from "@angular/core";
import {HttpClient} from "../stuff/http.client";
import {Utils} from "../stuff/utils";
import {ServiceInterface} from "./interface.service";


export abstract class AbstractService<T> implements ServiceInterface<T> {

  private static DEFAULT_CACHE_AGE = 10*60*1000; // 10 minutes.

  private timeKeeper: Date = new Date();

  private cache: Map<string, T | T[]> = new Map<string, T | T[]> ();

  private lastCacheClearMillis: number;

  onCreate: EventEmitter<T> = new EventEmitter<T>();
  onUpdate: EventEmitter<T> = new EventEmitter<T>();
  onDelete: EventEmitter<T> = new EventEmitter<T>();

  constructor(
    protected utils : Utils,
    protected httpClient: HttpClient,
    protected accessProvider: AccessTokenService) {

    this.lastCacheClearMillis = this.timeKeeper.getMilliseconds();
  }

  abstract getPath() : string;

  abstract getId(member: T) : string;

  /**
   * Override this to make the cache last longer or shorter periods.
   * @returns {number} The number of milliseconds after which cache should be eliminated.
   */
  protected maxCacheAge(): number {
    return AbstractService.DEFAULT_CACHE_AGE;
  }

  get(id: string) : Promise<T[]> {
    this.checkGate();
    Utils.throwIfNull(id);

    const cachedResult = this.getCachedValue(this.getPath(), id);
    if (cachedResult) {
      return Promise.resolve(cachedResult);
    }

    return this.httpClient.get(this.getPath(), id)
      .then((value: T[]) => {
        this.updateCache(value, this.getPath(), id);
        return value;
      });
  }

  list() : Promise<T[]> {
    this.checkGate();

    const cachedResult = this.getCachedValue(this.getPath());
    if (cachedResult) {
      return Promise.resolve(cachedResult);
    }

    return this.httpClient.list(this.getPath())
      .then((value: T[]) => {
        this.updateCache(value, this.getPath());
        return value;
      });
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

  delete(member: T): Promise<boolean> {
    this.checkGate();
    Utils.throwIfAnyNull([member, this.getId(member)]);

    return this.httpClient.delete(this.getPath(), this.getId(member))
        .then(() => {
          this.deleteCachedValue(this.getPath(), this.getId(member));
          this.deleteCachedValue(this.getPath());
          this.onDelete.emit(member);
          return true;
        });
  }

  protected checkGate() : void {
    if (!this.accessProvider.supposedToBeLoggedIn()) {
      throw ErrorType.NotLoggedIn;
    }
  }

  private updateCache(value: T | T[], ...pathElements) {
    this.cache.set(pathElements.join(), value);
  }

  private getCachedValue(...pathElements) : T | T[] {
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
