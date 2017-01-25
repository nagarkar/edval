import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Utils} from "../../stuff/utils";

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
    Utils.log("In rating nginit: " + this.ratingRange + ":");
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
    Utils.log("In setRating value:{0}, hasbeenselected:{1}", value.toString(), this.popped.toString());
    setTimeout(()=> {
      this.popped = false;
      Utils.log("Reset hasBeenSelected: {0}", this.popped.toString());
    }, 1300);
  }
}
