import {AccessTokenService} from "../aws/access.token.service";
import {ErrorType} from "../stuff/error.types";
import {EventEmitter} from "@angular/core";
import {HttpClient} from "../stuff/http.client";
import {Utils} from "../stuff/utils";
import {ServiceInterface} from "./interface.service";


export abstract class AbstractMockService<T> implements ServiceInterface<T> {

  abstract mockData() : Map<string, T>;
  abstract reset();
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
    return Promise.resolve(JSON.parse(JSON.stringify(member)));
  }

  public delete(id: string) : Promise<boolean> {
    //TODO Add assertion (npm install check-preconditions)
    this.deleteFromCache(id);
    this.onDelete.emit(id);
    return Promise.resolve(true);
    //return this.delete(staffMember);
  }


  private deleteFromCache(id: string) : void {
    this.mockData().delete(id);
  }

  private updateCache(member: T) : void {
    this.mockData().set(this.getId(member), member);
  }
}
