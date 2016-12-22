import {EventEmitter} from "@angular/core";
/**
 * Created by chinmay on 12/21/16.
 */

export class ObjectCycler<T> {

  onNewObj: EventEmitter<T> = new EventEmitter<T>();
  private currentIndex: number = 0;

  constructor(interval?: number, ...objsToCycle: T[]) {
    setInterval(()=> {
      this.currentIndex = (this.currentIndex + 1) % objsToCycle.length;
      this.onNewObj.emit(objsToCycle[this.currentIndex]);
    }, interval || 15000 /*http://museumtwo.blogspot.com/2010/10/getting-people-in-door-design-tips-from.html */);
  }

}
