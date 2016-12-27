import {Component, Output, EventEmitter, Input} from "@angular/core";

declare var Winwheel: (options?: any, drawWheel?: boolean) => void;

@Component({
  templateUrl: 'wheel.component.html',
  selector:'wheel'
})
export class WheelComponent {

  private id: string;
  private _options: any = {};
  wheel: any;
  wheelSpinning = false;

  @Output() animationDone = new EventEmitter();
  @Input() set options(options: any) {
    this._options = options;
    Object.assign(this._options, {
      canvasId: this.id,
      callbackFinished : () => {this.done()}
    });
  };

  constructor () {
    this.id = 'canvas' + Math.floor(Math.random() * 1000);
    this._options = Object.assign({}, WheelComponent.DEFAULT_OPTIONS, {
      canvasId: this.id,
      callbackFinished : () => {this.done()}
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.initWheel();
    }, 50)
  }

  initWheel() {
    this.wheel = new Winwheel(this._options);
  }

  startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (this.wheelSpinning == false)
    {
      this.wheel.animation.spins = 3;
      this.wheel.startAnimation();
      this.wheelSpinning = true;
    }
  }

  done() {
    var winningSegment = this.wheel.getIndicatedSegment();
    // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
    this.animationDone.emit(winningSegment);
    this.disable();
  }

  disable() {
    this.wheelSpinning = true;
  }

  enable() {
    this.wheelSpinning = false;
  }

  static DEFAULT_OPTIONS: any = {
      'numSegments'   : 15,   // Specify number of segments.
      'outerRadius'   : 212,  // Set radius to so wheel fits the background.
      'innerRadius'   : 40,  // Set inner radius to make wheel hollow.
      'textFontSize'  : 16,   // Set font size accordingly.
      'textMargin'    : 0,    // Take out default margin.
      'segments'      :       // Define segments including colour and text.
        [
          {'fillStyle' : '#eae56f', 'text' : '$5 Gift Card'},
          {'fillStyle' : '#89f26e', 'text' : 'No Luck'},
          {'fillStyle' : '#7de6ef', 'text' : 'Another time'},
          {'fillStyle' : '#e7706f', 'text' : 'Its Ok'},
          {'fillStyle' : '#eae56f', 'text' : 'No Deal!'},
          {'fillStyle' : '#89f26e', 'text' : '$5 Gift Card'},
          {'fillStyle' : '#7de6ef', 'text' : 'Its Ok'},
          {'fillStyle' : '#e7706f', 'text' : 'Another time'},
          {'fillStyle' : '#eae56f', 'text' : 'No Luck'},
          {'fillStyle' : '#89f26e', 'text' : 'No Deal!'},
          {'fillStyle' : '#7de6ef', 'text' : '$5 Gift Card'},
          {'fillStyle' : '#e7706f', 'text' : 'No Deal!'},
          {'fillStyle' : '#eae56f', 'text' : 'Another time'},
          {'fillStyle' : '#89f26e', 'text' : 'No Luck'},
          {'fillStyle' : '#7de6ef', 'text' : 'Its Ok'}
        ],
      'animation' : {
        'type'     : 'spinToStop',
        'duration' : 5,
        'spins'    : 8
      }
    };
}
