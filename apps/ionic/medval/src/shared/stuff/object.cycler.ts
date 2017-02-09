/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {EventEmitter} from "@angular/core";
/**
 * Created by chinmay on 12/21/16.
 */

export class ObjectCycler<T> {

  onNewObj: EventEmitter<T> = new EventEmitter<T>();
  private currentIndex: number = 0;
  private intervalTimer: number = 0;

  constructor(interval?: number, ...objsToCycle: T[]) {
    this.intervalTimer = setInterval(()=> {
      this.currentIndex = (this.currentIndex + 1) % objsToCycle.length;
      this.onNewObj.emit(objsToCycle[this.currentIndex]);
    }, interval || 15000 /*http://museumtwo.blogspot.com/2010/10/getting-people-in-door-design-tips-from.html */);
  }

  ngOnDestroy() {
    clearInterval(this.intervalTimer);
  }

}
