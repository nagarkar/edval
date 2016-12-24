import {EventEmitter} from "@angular/core";

export interface ServiceInterface<T> {

  onCreate: EventEmitter<T>;
  onUpdate: EventEmitter<T>;
  onDelete: EventEmitter<string>;

  get(id: string, dontuseCache?: boolean) : Promise<T>;
  list(dontuseCache?: boolean) : Promise<Array<T>>;

  getCached(id: string) : T;
  listCached() : Array<T>;

  update(member: T) : Promise<T>;
  create(member: T) : Promise<T>;
  delete(id: string) : Promise<boolean>;

  getId(member: T) : string;

  /**
   * Reset the service; this should clear and prime the cache if any, or mock data should be 'recomputed' in the current
   * context, etc.
   */
  reset(): void;
}
