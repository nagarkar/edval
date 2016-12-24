import {EventEmitter} from "@angular/core";
import {ServiceInterface} from "./interface.service";
import {AbstractService} from "./abstract.service";
import {Config} from "../aws/config";
import {AbstractMockService} from "./abstract.mock.service";
import {Utils} from "../stuff/utils";

declare let REVVOLVE_PROD_ENV: boolean;

export abstract class DelegatingService<T> implements ServiceInterface<T> {

  private mockMode: boolean = !REVVOLVE_PROD_ENV;

  public onCreate: EventEmitter<T> = new EventEmitter<T>();
  public onUpdate: EventEmitter<T> = new EventEmitter<T>();
  public onDelete: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private mockService: AbstractMockService<T>,
    private liveService: AbstractService<T>) {

    this.subscribeToEventsFor(this.getDelegate());
  }

  setMockMode(mode: boolean) {
    let needReset: boolean = this.mockMode != mode;
    let prevDelegate: ServiceInterface<T> = this.getDelegate();
    this.mockMode = mode;
    if (needReset) {
      this.resetIncludingEvents(prevDelegate);
    }
  }

  getDelegate(): ServiceInterface<T> {
    if (this.mockMode) {
      return this.mockService;
    } else {
      return this.liveService;
    }
  }

  private resetIncludingEvents(prevDelegate: ServiceInterface<T>) {
    this.unSubscribeToEventsFor(prevDelegate);
    this.reset();
    this.subscribeToEventsFor(this.getDelegate());
  }

  reset() {
    this.getDelegate().reset();
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

  private subscribeToEventsFor(delegate: ServiceInterface<T>) {
    function delegateToEvent(emitter: EventEmitter<T|string>, emitterSource: EventEmitter<T|string>) {
      emitter.subscribe(
        (next: T|string)=>{
          emitterSource.emit(next);
        },
        (error: any) => {
          emitterSource.error(error);
        },
        ()=> {
          emitterSource.complete();
        });
    }
    delegateToEvent(delegate.onUpdate, this.onUpdate);
    delegateToEvent(delegate.onCreate, this.onCreate);
    delegateToEvent(delegate.onDelete, this.onDelete);
  }

  private unSubscribeToEventsFor(delegate: ServiceInterface<any>) {
    delegate.onUpdate.unsubscribe();
    delegate.onCreate.unsubscribe();
    delegate.onDelete.unsubscribe();
  }

}
