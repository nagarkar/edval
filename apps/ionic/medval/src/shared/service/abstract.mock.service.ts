import {AccessTokenService} from "../aws/access.token.service";
import {EventEmitter} from "@angular/core";
import {Utils} from "../stuff/utils";
import {ServiceInterface} from "./interface.service";


export abstract class AbstractMockService<T> implements ServiceInterface<T> {

  abstract mockData() : Map<string, T>;
  abstract reset(): any;
  abstract getId(member: T) : string;
  abstract setId(member: T, id: string): string;

  onCreate: EventEmitter<T> = new EventEmitter<T>();
  onUpdate: EventEmitter<T> = new EventEmitter<T>();
  onDelete: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    protected utils : Utils,
    protected accessProvider: AccessTokenService) {

  }

  get(id: string, dontuseCache?: boolean) : Promise<T> {
    return Promise.resolve(this.mockData().get(id));
  }

  list() : Promise<T[]> {
    return Promise.resolve(Array.from(this.mockData().values()));
  }

  listCached() : T[] {
    return Array.from(this.mockData().values());
  }

  getCached(id: string) : T {
    return this.mockData().get(id);
  }

  update(member: T) : Promise<T> {
    //TODO Add assertion (npm install check-preconditions)
    this.updateCache(member);
    this.onUpdate.emit(member);
    return Promise.resolve(member);
  }

  create(member: T): Promise<T> {
    if (!this.getId(member)) {
      this.setId(member, "id-"+Math.ceil(Math.random()*10e10));
    }
    this.updateCache(member);
    this.onCreate.emit(member);
    // We use JSON.stringify to copy instead of Utils.stringify because we expect
    // there are no circular references.
    return Promise.resolve(JSON.parse(Utils.stringify(member)));
  }

  delete(id: string) : Promise<void> {
    //TODO Add assertion (npm install check-preconditions)
    this.deleteFromCache(id);
    this.onDelete.emit(id);
    return Promise.resolve();
  }

  /** Override this method to implement validations */
  validate(members: T[]): Error[] {
    return [];
  }

  clearCache() {
    this.mockData().clear();
  }

  private deleteFromCache(id: string) : void {
    this.mockData().delete(id);
  }

  private updateCache(member: T) : void {
    this.mockData().set(this.getId(member), member);
  }
}
