import {
  Component,
  Input,
  Output,
  EventEmitter,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

import {Utils} from "../stuff/utils";
import {Icon} from "ionic-angular";

@Component({
  selector: 'rating',
  templateUrl: 'rating.component.html',
  animations: [
    trigger('ratingPicked', [

      state('activePopped', style({
        transform: 'scale(2)',
        padding:"0 0 0 0",
        'z-index':'2',
        display:'inline-block'
      })),
      state('inactivePopped',   style({
        display:'none'
      })),
      state('activeNormal', style({
        transform: 'scale(1.2)',
        display:'inline-block'
      })),
      state('inactiveNormal',   style({
        transform: 'scale(1.2)',
        display:'inline-block'
      })),
      // http://cubic-bezier.com/#.57,0,.23,.98
      transition('* => activePopped', animate('300ms cubic-bezier(.89,.39,.84,.5)')),
      transition('inactivePopped => inactiveNormal', animate('500ms cubic-bezier(.89,.39,.84,.5)'))
    ])
  ]
})

export class RatingComponent {
  color: string = 'danger';
  onState: string = 'ion-ios-star ion-android-star';
  offState: string = 'ion-ios-star-outline ion-android-star-outline';
  private _ratingValue: number;
  ratingRange: number[];
  private _ratingMax: number = 5;
  private popped = false;
  @Output() ratingValueChange : EventEmitter<number> = new EventEmitter<number>();

  constructor(private utils: Utils) { }

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

  iconName(idx: number) {
    if (this.state(idx) == 'activePopped' || this.state(idx)  == 'activeNormal') {
      return 'star';
    }
    return 'star-outline';
  }

  state(idx: number) : 'activePopped' | 'inactivePopped' | 'activeNormal' | 'inactiveNormal' {
    //return this.popped ? ((idx < this.ratingValue) ? 'activePopped' : 'inactivePopped') : ((idx < this.ratingValue) ? 'activeNormal' : 'inactiveNormal');

    if (this.popped) {
      if (idx < this.ratingValue) {
        return 'activePopped';
      }
      return 'inactivePopped';
    }
    if (!this.popped) {
      if (idx < this.ratingValue) {
        return 'activeNormal';
      }
      return 'inactiveNormal';
    }
  }

  public setRating(value: number, icon?:Icon) {

    this.ratingValue = value;
    if(value <= 2) {
      this.color = 'danger';
    } else if (value <= 4) {
      this.color = 'yellow';
    } else if (value <= 6) {
      this.color = 'orange';
    } else if (value <= 8) {
      this.color = 'green';
    } else {
      this.color = 'darkgreen';
    }
    this.ratingValueChange.emit(value);
    this.popped = true;
    Utils.log("In setRating value:{0}, hasbeenselected:{1}", value, this.popped);
    setTimeout(()=> {
      this.popped = false;
      Utils.log("Reset hasBeenSelected: {0}", this.popped);
    }, 1300);
  }

  /*
  public isActiveIcon(idx: number) {
    let ret = (this.popped) && (idx < this.ratingValue);
    if (ret) {
   Utils.log("isActiveIcon value : {0}", ret);
    }
    return ret;
  }

  public iconClass(idx: number) {
    let ret = (idx < this.ratingValue) ? "onState" : "offState";
   Utils.log("iconClass value : {0} for index {1}", ret, idx);
    return ret;
  }

  public iconStyle(idx: number) {
    return "";//(idx < this.ratingValue) ? "z-index:2" : "display:none";
  }
  */
}
