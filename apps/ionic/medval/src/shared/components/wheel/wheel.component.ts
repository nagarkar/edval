/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, Output, EventEmitter, Input} from "@angular/core";
import {ViewController, AlertController, NavParams} from "ionic-angular";
import {Config} from "../../config";
import {AwsClient} from "../../aws/aws.client";

declare var Winwheel: (options?: any, drawWheel?: boolean) => void;

@Component({
  templateUrl: './wheel.component.html',
  selector:'wheel'
})
export class WheelComponent {

  private id: string;
  _options: any = {};
  wheel: any;
  wheelSpinning = false;

  @Output() animationDone = new EventEmitter<any>();

  @Input() set options(options: any) {
    this._options = options;
    Object.assign(this._options, {
      canvasId: this.id,
      callbackFinished : () => {this.done()}
    });
  };

  constructor (private viewctrl: ViewController,
               private alertctrl: AlertController,
               navParams: NavParams) {
    this.id = 'canvas' + Math.floor(Math.random() * 1000);
    if (navParams.get('options')) {
      this.options = navParams.get('options');
    } else {
      this.options = WheelComponent.DEFAULT_OPTIONS;
    }
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
    AwsClient.logEvent("Clicked Wheel Spinner");
    if (this.wheelSpinning == false)
    {
      this.wheel.animation.spins = 3;
      this.wheel.startAnimation();
      this.disable();
    }
  }

  done() {
    var segment = this.wheel.getIndicatedSegment();
    this.animationDone.emit(segment);
    this.disable();
    let data = { 'segment': segment};
    setTimeout(() => {
      if (segment.win) {
        this.presentAlertPrompt(()=>{
            this.viewctrl.dismiss(data);
          },
          "You WON the " + data.segment.text + "!!! Please pick up your winnings from the front-desk and enjoy!",
          "I collected the winnings!"
        );
      } else {
        this.presentAlertPrompt(()=>{
            this.viewctrl.dismiss(data);
          },
          "Sorry, we hope you win next time!",
          "Thanks for your feedback!"
        );
      }
    }, 2000); // just pause for a few secs.
  }

  private presentAlertPrompt(onselect: (result: string | any) => void, title: string, dismissText: string) {
    let alert = this.alertctrl.create({
      title: title,
      buttons: [
        {
          text: dismissText,
          handler: (data: any) => {
            onselect(data);
          }
        }
      ],
      cssClass:"bottom-10",
      enableBackdropDismiss:false
    });
    alert.present({
      animate: Config.ANIMATE_MODALS,
      easing:'ease-in',
      duration:100
    });
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
