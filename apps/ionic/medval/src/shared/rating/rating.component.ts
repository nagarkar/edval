import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';

import { NG_VALUE_ACCESSOR }from '@angular/forms';

const NO_OP = () => {};

@Component({
  selector: 'rating',
  templateUrl: 'rating.component.html',
  providers : [{
      provide : NG_VALUE_ACCESSOR,
      useExisting : forwardRef(() => RatingComponent),
      multi : true
  }]
})

export class RatingComponent implements OnInit {
  onState: string = 'ion-ios-star ion-android-star';
  offState: string = 'ion-ios-star-outline ion-android-star-outline';
  @Input() max: number = 5;

  @Output() private ratingValueChange : EventEmitter<number> = new EventEmitter<number>();

  private range: number[];
  private value: number;

  ngOnInit() {
    this.range = [this.max];
  }

  private setRating(value: number) {
    this.value = value;
    this.ratingValueChange.emit(value);
  }
}
