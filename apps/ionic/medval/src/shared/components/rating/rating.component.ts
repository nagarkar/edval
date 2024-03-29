/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'rating',
  templateUrl: './rating.component.html',
})
export class RatingComponent {
  color: string = 'danger';
  private _ratingValue: number = 1;
  ratingRange: number[];
  private _ratingMax: number = 5;
  private popped = false;
  @Output() ratingValueChange : EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  @Input()
  showLabels:boolean = true;

  @Input()
  get ratingValue() : number {
    return this._ratingValue;
  }
  set ratingValue(value: number) {
    this._ratingValue = value;
  }

  @Input()
  get ratingMax() : number {
    return this._ratingMax;
  }

  set ratingMax(max: number) {
    this._ratingMax = max;
    this.ratingRange  = new Array(max);
  }

  setRating(value: number) {

    let oldValue = this.ratingValue;
    this.ratingValue = value;
    if(value <= (2*this._ratingMax)/10) {
      this.color = 'yellow';
    } else if (value <= (4*this._ratingMax)/10) {
      this.color = 'danger';
    } else if (value <= (6*this._ratingMax)/11) {
      this.color = 'green';
    } else if (value <= (8*this._ratingMax)/11) {
      this.color = 'darkgreen';
    } else {
      this.color = 'revvolvepurple';
    }
    if (oldValue != this.ratingValue) {
      this.ratingValueChange.emit(value);
    }
    this.popped = true;
    setTimeout(()=> {
      this.popped = false;
    }, 1300);
  }
}
