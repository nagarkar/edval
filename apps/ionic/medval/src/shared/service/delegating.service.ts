import {EventEmitter} from "@angular/core";
import {ServiceInterface} from "./interface.service";
import {AbstractService} from "./abstract.service";
import {Config} from "../aws/config";
import {AbstractMockService} from "./abstract.mock.service";
import {ErrorType} from "../stuff/error.types";


export abstract class DelegatingService<T> implements ServiceInterface<T> {

  onCreate: EventEmitter<T> = new EventEmitter<T>();
  onUpdate: EventEmitter<T> = new EventEmitter<T>();
  onDelete: EventEmitter<string> = new EventEmitter<string>();

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
    this.mockService.reset();
    this.liveService.reset();
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
