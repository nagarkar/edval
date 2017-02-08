/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {EventEmitter} from "@angular/core";
import {ServiceInterface} from "./interface.service";
import {ClassType} from "../stuff/utils";
import {Config} from "../config";

export abstract class DelegatingService<T> implements ServiceInterface<T> {

  private mockMode: boolean = null;

  public onCreate: EventEmitter<T> = new EventEmitter<T>();
  public onUpdate: EventEmitter<T> = new EventEmitter<T>();
  public onDelete: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private mockService: ServiceInterface<T>,
    private liveService: ServiceInterface<T>,
    private clazz?: ClassType<T>) {

    this.mockMode = clazz ? Config.MOCK_DATA[clazz.name] : true;
    this.subscribeToEventsFor(this.getDelegate());
  }

  inMockMode() {
    return this.mockMode;
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
    prevDelegate.clearCache();
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

  clearCache() {
    this.getDelegate().clearCache();
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

  delete(id: string): Promise<void> {
    return this.getDelegate().delete(id);
  }

  /** Override this method to implmeent validations */
  validate(members: T[]): Error[] {
    return this.getDelegate().validate(members);
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
