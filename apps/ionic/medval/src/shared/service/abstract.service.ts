import {AccessTokenService} from "../aws/access.token.service";
import {ErrorType} from "../stuff/error.types";
import {EventEmitter} from "@angular/core";
import {HttpClient} from "../stuff/http.client";
import {Utils} from "../stuff/utils";
import {ServiceInterface} from "./interface.service";


export abstract class AbstractService<T> implements ServiceInterface<T> {

  onCreate: EventEmitter<T> = new EventEmitter<T>();
  onUpdate: EventEmitter<T> = new EventEmitter<T>();
  onDelete: EventEmitter<T> = new EventEmitter<T>();

  constructor(
    protected utils : Utils,
    protected httpClient: HttpClient,
    protected accessProvider: AccessTokenService) { }

  abstract getPath() : string;

  abstract getId(member: T) : string;

  get(id: string) : Promise<T[]> {
    this.checkGate();
    return this.httpClient.get(this.getPath(), id);
  }

  list() : Promise<T[]> {
    this.checkGate();
    return this.httpClient.list(this.getPath());
  }

  create(member: T): Promise<T> {
    this.checkGate();
    return this.httpClient.post(this.getPath(), member)
        .then((value: T) => {
          this.onCreate.emit(value);
          return value;
        });
  }

  update(member: T): Promise<T> {
    this.checkGate();
    return this.httpClient.put(this.getPath(), this.getId(member), member)
        .then((value: T) => {
          this.onUpdate.emit(value);
          return value;
      });
  }

  delete(member: T, id?: string): Promise<boolean> {
    return this.httpClient.delete(this.getPath(), this.getId(member))
        .then(() => {
          this.onDelete.emit(member);
          return true;
        });
  }

  protected checkGate() : void {
    if (!this.accessProvider.supposedToBeLoggedIn()) {
      throw ErrorType.NotLoggedIn;
    }
  }

}
