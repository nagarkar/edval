/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Utils} from "./utils";
export class CircularList<T> implements Iterable<T> {

  private size: number;
  private list: Array<T>;
  private nextIndex: number;

  [Symbol.iterator]() {
    let index = this.nextIndex;
    let size = this.size;
    let count = 0;
    return {
      next: () => {
        let value = this.list[index];
        let done = (count >= size);
        index = CircularList.next(index, size);
        count++;
        return { value, done };
      }
    };
  }

  constructor(size: number) {
    Utils.throwIfNNOU(size);
    this.size = size;
    this.list = new Array<T>(size);
    this.nextIndex = 0;
  }

  add(obj: T): CircularList<T> {
    this.checkInvalid();
    this.list[this.nextIndex] = obj;
    this.advanceCursor();
    return this;
  }

  forEach(callbackfn: (value?: T, index?: number) => void) {
    let origIndex = this.nextIndex;
    this.checkInvalid();
    try {
      for (let i = 0; i < this.size; i++) {
        callbackfn(this.list[this.nextIndex], this.nextIndex);
        this.advanceCursor();
      }
    }
    catch(err) {
      this.nextIndex = origIndex;
      throw err;
    }
  }

  private checkInvalid() {
    Utils.throwIf(this.list.length != this.size, "Size of fixed length array somehow changed. Abort");
  }

  private advanceCursor() {
    this.nextIndex = CircularList.next(this.nextIndex, this.list.length);
  }

  private static next(idx: number, length: number): number {
    return (idx + 1) % length;
  }

  get length() {
    this.checkInvalid();
    return this.size;
  }

}
