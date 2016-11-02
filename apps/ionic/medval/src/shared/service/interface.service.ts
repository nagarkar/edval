import {EventEmitter} from "@angular/core";

export interface ServiceInterface<T> {

  onCreate: EventEmitter<T>;
  onUpdate: EventEmitter<T>;
  onDelete: EventEmitter<T>;

  get(id: string) : Promise<T>;
  list() : Promise<T[]>;
  update(member: T) : Promise<T>;
  create(member: T) : Promise<T>;
  delete(member: T) : Promise<boolean>;

  getId(member: T) : string;
}
