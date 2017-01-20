import {Component, Input} from "@angular/core";
import {NavParams} from "ionic-angular";

@Component({
  template: `
    <div class="progress-bar">
      <span [style.color] = 'white' [style.width]="progressWidth">{{'Progress:' + workoutProgress}}</span>
    </div>
  `,
  selector: 'progress-bar'
})
export class ProgressbarComponent {

  // Fraction between 0 and 1
  _progress: number = 0;

  @Input()
  set progress(prg: number) {
    if (prg > 1) {
      prg = 1;
    } else if (prg < 0) {
      prg= .1;
    }
    this._progress = prg;
  }

  get progressWidth() : string {
   if (this._progress < 0.3) {
     return "30%";
   }
   return this.workoutProgress;
  }

  get workoutProgress() : string {
    return Math.floor(this._progress*100) + '%';
  }

  constructor(navParams: NavParams){
    this.progress = +navParams.get('progress') || this._progress;
  }

}
