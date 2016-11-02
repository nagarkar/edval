import {EventEmitter} from "@angular/core";
import {ServiceInterface} from "./interface.service";
import {AbstractService} from "./abstract.service";
import {Config} from "../aws/config";
import {AbstractMockService} from "./abstract.mock.service";
import {ErrorType} from "../stuff/error.types";


export abstract class DelegatingService<T> implements ServiceInterface<T> {

  abstract getId(member: T) : string;

  onCreate: EventEmitter<T>;
  onUpdate: EventEmitter<T>;
  onDelete: EventEmitter<T>;

  private delegate : ServiceInterface<T>;

  constructor(
    private mockService: AbstractMockService<T>,
    private liveService: AbstractService<T>) {

    if (Config.isMockData()) {
      this.delegate = mockService;
    } else {
      this.delegate = liveService;
    }
    this.delegateEventEmitters();
  }

  get(id: string) : Promise<T> {
    return this.delegate.get(id);
  }

  list(): Promise<T[]> {
    return this.delegate.list();
  }

  create(TMember: T): Promise<T> {
    return this.delegate.create(TMember);
  }

  update(TMember: T): Promise<T> {
    return this.delegate.update(TMember);
  }

  delete(TMember: T): Promise<boolean> {
    return this.delegate.delete(TMember);
  }

  private delegateEventEmitters() {
    this.onCreate = this.delegate.onCreate;
    this.onDelete = this.delegate.onDelete;
    this.onUpdate = this.delegate.onUpdate;
  }

}
