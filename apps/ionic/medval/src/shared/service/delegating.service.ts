import {EventEmitter} from "@angular/core";
import {ServiceInterface} from "./interface.service";
import {AbstractService} from "./abstract.service";
import {Config} from "../aws/config";
import {AbstractMockService} from "./abstract.mock.service";
import {ErrorType} from "../stuff/error.types";
import {Utils} from "../stuff/utils";


export abstract class DelegatingService<T> implements ServiceInterface<T> {

  public onCreate: EventEmitter<T> = new EventEmitter<T>();
  public onUpdate: EventEmitter<T> = new EventEmitter<T>();
  public onDelete: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private mockService: AbstractMockService<T>,
    private liveService: AbstractService<T>) {

    this.delegateEventEmitters();
  }

  getDelegate(): ServiceInterface<T> {
    if (Config.isMockData(this.liveService.getInstance())) {
      return this.mockService;
    } else {
      return this.liveService;
    }
  }

  reset() {
    if (this.inMockMode()) {
      Utils.log("Reseting mock service for object:{0}", this.getObjectName());
      this.mockService.reset();
    } else {
      Utils.log("Reseting live service for object:{0}", this.getObjectName());
      this.liveService.reset();
    }
  }

  getId(member: T): string {
    return this.getDelegate().getId(member);
  }

  get(id: string, dontuseCache?: boolean) : Promise<T> {
    return this.getDelegate().get(id, dontuseCache);
  }

  list(dontuseCache?: boolean): Promise<T[]> {
    return this.getDelegate().list(dontuseCache);
  }

  getCached(id: string) : T {
    return this.getDelegate().getCached(id);
  }

  listCached(): T[] {
    return this.getDelegate().listCached();
  }

  create(TMember: T): Promise<T> {
    return this.getDelegate().create(TMember);
  }

  update(TMember: T): Promise<T> {
    return this.getDelegate().update(TMember);
  }

  delete(id: string): Promise<boolean> {
    return this.getDelegate().delete(id);
  }

  private inMockMode() : boolean {
    return Config.isMockData(this.liveService.getInstance());
  }

  private getObjectName() : string {
    return Utils.getObjectName(this.liveService.getInstance());
  }

  private delegateEventEmitters() {
    this.mockService.onUpdate.subscribe((next: T)=>{
      this.onUpdate.emit(next);
    });
    this.liveService.onUpdate.subscribe((next: T)=>{
      this.onUpdate.emit(next);
    });
    this.mockService.onCreate.subscribe((next: T)=>{
      this.onCreate.emit(next);
    });
    this.liveService.onCreate.subscribe((next: T)=>{
      this.onCreate.emit(next);
    });
    this.mockService.onDelete.subscribe((next: string)=>{
      this.onDelete.emit(next);
    });
    this.liveService.onDelete.subscribe((next: string)=>{
      this.onDelete.emit(next);
    });
  }

}
