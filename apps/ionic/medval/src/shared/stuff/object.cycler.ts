/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {EventEmitter} from "@angular/core";
import {NativeAudio} from "ionic-native";
/**
 * Created by chinmay on 12/21/16.
 */

export class ObjectCycler<T> {

  onNewObj: EventEmitter<T> = new EventEmitter<T>();
  currentObject: T;

  private currentIndex: number = 0;
  private intervalTimer: number = 0;
  private objsToCycle: T[];

  constructor(interval?: number, ...objsToCycle: T[]) {

    this.objsToCycle = objsToCycle;
    this.cycle();
    this.intervalTimer = setInterval(()=> {
      this.cycle();
      this.onNewObj.emit(this.currentObject);
    }, interval || 15000 /*http://museumtwo.blogspot.com/2010/10/getting-people-in-door-design-tips-from.html */);
  }

  cycle(): void {
    this.currentIndex = (this.currentIndex + 1) % this.objsToCycle.length;
    this.currentObject = this.objsToCycle[this.currentIndex];
  }

  ngOnDestroy() {
    clearInterval(this.intervalTimer);
  }

}

export class ImageCycler extends ObjectCycler<any> {

  constructor(width: number, height: number, style: string, interval?: number, ...urlsToCycle: string[]) {
    let images: Object[] = urlsToCycle.map((url: string)=> {
      let img;
      if (height && width) {
        img = new Image(width, height);
      } else {
        img = new Image();
      }
      if (style) {
        img.setAttribute('style', style);
      }
      img.src = url;
      return img;
    })
    super(interval, ...images);
  }
}

export class SoundCycler extends ObjectCycler<any> {

  constructor(interval?: number, ...urlsToCycle: string[]) {
    urlsToCycle.forEach((url: string)=>{
      NativeAudio.preloadSimple(url, url);
    });
    super(interval, ...urlsToCycle);
  }
}
