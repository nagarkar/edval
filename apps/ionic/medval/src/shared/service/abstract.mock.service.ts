import {AccessTokenService} from "../aws/access.token.service";
import {ErrorType} from "../stuff/error.types";
import {EventEmitter} from "@angular/core";
import {HttpClient} from "../stuff/http.client";
import {Utils} from "../stuff/utils";
import {ServiceInterface} from "./interface.service";


export abstract class AbstractMockService<T> implements ServiceInterface<T> {

  abstract mockData() : Map<string, T>;
  abstract getId(member: T) : string;
  abstract setId(member: T, id: string): string;

  onCreate: EventEmitter<T> = new EventEmitter<T>();
  onUpdate: EventEmitter<T> = new EventEmitter<T>();
  onDelete: EventEmitter<T> = new EventEmitter<T>();

  constructor(
    protected utils : Utils,
    protected accessProvider: AccessTokenService) { }

  get(id: string) : Promise<T[]> {
    return Promise.resolve(this.mockData().get(id));
  }

  list() : Promise<T[]> {
    return Promise.resolve(Array.from(this.mockData().values()));
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

  public delete(staffMember: T) : Promise<boolean> {
    //TODO Add assertion (npm install check-preconditions)
    this.deleteFromCache(staffMember);
    this.onDelete.emit(staffMember);
    return Promise.resolve(true);
    //return this.delete(staffMember);
  }


  private deleteFromCache(member: T) : void {
    this.mockData().delete(this.getId(member));
  }

  private updateCache(member: T) : void {
    this.mockData().set(this.getId(member), member);
  }
}
