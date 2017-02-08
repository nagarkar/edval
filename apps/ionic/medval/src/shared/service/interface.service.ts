/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {EventEmitter} from "@angular/core";

export interface ServiceInterface<T> {

  onCreate: EventEmitter<T>;
  onUpdate: EventEmitter<T>;
  onDelete: EventEmitter<string>;

  get(id: string, dontuseCache?: boolean) : Promise<T>;
  list(dontuseCache?: boolean) : Promise<Array<T>>;

  getCached(id: string) : T;
  listCached() : Array<T>;

  // Visible for Testing
  clearCache(): void;

  update(member: T) : Promise<T>;
  create(member: T) : Promise<T>;
  delete(id: string) : Promise<void>;

  getId(member: T) : string;

  /**
   * Reset the service; this should clear and prime the cache if any, or mock data should be 'recomputed' in the current
   * context, etc.
   */
  reset(): void;

  validate(members: T[]): Error[];
}
