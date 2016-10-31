import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import {Utils} from "../stuff/utils";

@Component({
  selector: 'rating',
  templateUrl: 'rating.component.html'
})

export class RatingComponent {
  onState: string = 'ion-ios-star ion-android-star';
  offState: string = 'ion-ios-star-outline ion-android-star-outline';
  private _ratingValue: number;
  ratingRange: number[];
  private _ratingMax: number = 5;
  @Output() ratingValueChange : EventEmitter<number> = new EventEmitter<number>();

  constructor(private utils: Utils) { }

  @Input()
  get ratingValue() : number {
    return this._ratingValue;
  }
  set ratingValue(value: number) {
    this._ratingValue = value;
    this.utils.log("rating value set: " + value);
  }

  @Input()
  get ratingMax() : number {
    return this._ratingMax;
  }
  set ratingMax(max: number) {
    this._ratingMax = max;
    this.ratingRange  = new Array(max);
    this.utils.log("In rating nginit: " + this.ratingRange + ":");
  }

  public setRating(value: number) {
    this.ratingValue = value;
    this.ratingValueChange.emit(value);
  }
}
