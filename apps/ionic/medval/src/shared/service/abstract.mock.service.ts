import {AccessTokenService} from "../aws/access.token.service";
import {ErrorType} from "../stuff/error.types";
import {EventEmitter} from "@angular/core";
import {HttpClient} from "../stuff/http.client";
import {Utils} from "../stuff/utils";
import {ServiceInterface} from "./interface.service";


export abstract class AbstractMockService<T> implements ServiceInterface<T> {

  abstract mockData() : Map<string, T>;
  abstract getId(member: T) : string;

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
    return Promise.resolve(JSON.parse(JSON.stringify(member))); // copy the member to a new object.
  }

  create(member: T): Promise<T> {
    this.updateCache(member);
    this.onCreate.emit(member);
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
