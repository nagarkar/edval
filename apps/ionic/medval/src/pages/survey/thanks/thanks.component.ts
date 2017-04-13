/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from "@angular/core";
import {NavController, NavParams, Modal, ModalController, AlertController} from "ionic-angular";
import {Config} from "../../../shared/config";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {ImageCycler} from "../../../shared/stuff/object.cycler";
import {Idle} from "@ng-idle/core";
import {WheelComponent} from "../../../shared/components/wheel/wheel.component";
import {SurveyPage} from "../survey.page";
import {AnyDetractors} from "../../../services/survey/survey.functions";
import {AccountConfiguration} from "../../../services/account/schema";
import {Subscription} from "rxjs";
import {DeviceServices} from "../../../shared/service/DeviceServices";
import {SurveyNavigator} from "../../../services/survey/survey.navigator";

@Component({
  templateUrl: './thanks.component.html',
})
export class ThanksComponent extends SurveyPage implements OnInit, OnDestroy {

  surveyNavigator: SurveyNavigator;

  showWheel: boolean = false;
  showJokes: boolean = false;

  message: string[];
  private static cycler: ImageCycler = new ImageCycler(
    null, // Height
    null, // Width
    // {webkitTransform: "translate3d(0, 0, 0);", transform: "translate3d(0, 0, 0)", position:"relative", bottom:"-1em"},
    null, // Style
    null,
    ...Utils.shuffle([
      "https://s3.amazonaws.com/revvolveapp/jokes/joke2.gif",
      "https://s3.amazonaws.com/revvolveapp/jokes/joke3.jpg",
      "https://s3.amazonaws.com/revvolveapp/jokes/joke5.jpg",
      "https://s3.amazonaws.com/revvolveapp/jokes/joke6.jpg",
      "https://s3.amazonaws.com/revvolveapp/jokes/joke7.jpg",
      "https://s3.amazonaws.com/revvolveapp/jokes/joke8.gif",
      "https://s3.amazonaws.com/revvolveapp/jokes/joke9.gif",
      "https://s3.amazonaws.com/revvolveapp/jokes/joke10.gif",
      "https://s3.amazonaws.com/revvolveapp/jokes/joke11.jpg",
      "https://s3.amazonaws.com/revvolveapp/jokes/joke13.jpg",
      "https://s3.amazonaws.com/revvolveapp/jokes/joke13.png",
    ])
  );
  private imageSubscription: Subscription;

  private static thanksSounds: string[] = ['assets/mp3/aryathanks.mp3' /*, 'assets/mp3/arhantthanks.mp3'*/];
  private static playSounds: string[] = ['assets/mp3/aryaspin.mp3'/*, 'assets/mp3/arhantspin.mp3'*/];

  private static soundsInitialized: boolean;

  @ViewChild("imgDiv")
  imgDiv: ElementRef;

  wheelOptions: any;
  costPerUse: number;
  award: number;
  giftMessage: string;

  idleSeconds(): number {
    return 30;
  }

  timeoutSeconds(): number {
    return 30;
  }

  constructor(
    idle: Idle,
    protected sessionSvc: SessionService,
    protected navCtrl: NavController,
    alertCtrl: AlertController,
    private modalctrl: ModalController,
    navParams: NavParams) {

    super(navCtrl, alertCtrl, sessionSvc, idle);

    try {
      this.surveyNavigator = this.sessionSvc.surveyNavigator;
      this.message = this.constructMessage(navParams.get('message'));
      this.initializeSoundsIfNecessary();
    } catch(err) {
      Utils.error(err);
    }
  }

  ngOnInit() {
    try {
      this.setupMessagesAndAttractions()
        .then(()=>{
          Utils.info("All Messages Spoken")
        });

      setTimeout(()=>{
        this.sessionSvc.closeCurrentSession();
      }, 100);
    } catch(err) {
      Utils.error(err);
    }
  }

  ngOnDestroy() {
    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }
  }

  get shouldOfferWheel() {
    if (!this.showWheel) {
      return false;
    }
    if (Date.now() > Config.LAST_SWEEPSTAKE_MILLIS  + Config.MINUTES_BETWEEN_SWEEPSTAKES * 60 * 1000) {
      return true;
    } else {
      return false;
    }
  }

  showWheelModal() {
    if (!this.shouldOfferWheel) {
      return;
    }
    Config.LAST_SWEEPSTAKE_MILLIS = Date.now();
    this.startIdling(60, 60); // reset the clock, double it.
    let profileModal : Modal = this.modalctrl.create(WheelComponent, {options: this.wheelOptions});
    profileModal.onWillDismiss((data) => {
      this.showWheel = false;
    });
    profileModal.present();
  }

  private setupImageHandling() {
    let cycler = ThanksComponent.cycler;
    let setImage = (next: HTMLImageElement) => {
      let div: HTMLDivElement = this.imgDiv.nativeElement;
      div.removeChild(div.children.item(0));
      div.appendChild(next);
    }
    setImage(cycler.currentObject);
    this.imageSubscription = cycler.onNewObj.subscribe((next: HTMLImageElement)=> {
      setImage(next);
    });
  }

  private constructMessage(input: any): string[] {
    if (!input || !input.length || input.length == 0) {
      return [
        "Thanks for your feedback!",
        this.getFeedbackBenefitString()
      ];
    }
    if (typeof input === 'string'){
      return [input];
    }
    return input;
  }

  private static getDefaultOptions(giftMessage: string, costPerUse: number, award: number): {} {

    // Followng logic sould work if costPerUse is >0, < 1 but not if it's a fractional value > 1.

    let outcomes = this.getSuccessAndTotalOutcomeIntegers(costPerUse, award);
    let ret: any = {
      giftMessage: giftMessage,
      chance: Utils.format("about {0}%", Math.floor(100*outcomes.costPerUse/outcomes.award))
    }

    let giftSegment = {'fillStyle' : '#eae56f', 'text': giftMessage, win: true};
    let noWinSegments = [
      {'fillStyle' : '#89f26e', 'text' : 'No Luck'},
      {'fillStyle' : '#7de6ef', 'text' : 'Another time'},
      {'fillStyle' : '#e7706f', 'text' : 'Not this time'},
      {'fillStyle' : '#89f26e', 'text' : 'No Deal!'},
      {'fillStyle' : '#7de6ef', 'text' : 'Try next time!'},
    ];

    //costPerUse  = winSlots * award/totalSlots;
    let loseSlotsPerWinSlots = Math.ceil(award/costPerUse - 1);
    let winSlots = 3;
    let numSegments = winSlots * (1 + loseSlotsPerWinSlots);

    ret = Object.assign(ret, {
      'numSegments': numSegments,   // Specify number of segments.
      'outerRadius': 212,  // Set radius to so wheel fits the background.
      'innerRadius': 40,  // Set inner radius to make wheel hollow.
      'textFontSize': 16,   // Set font size accordingly.
      'textMargin': 0,    // Take out default margin.
      'animation' : {
        'type'     : 'spinToStop',
        'duration' : 5,
        'spins'    : 8
      }
    });
    let segments: any[] = [];
    for(let i = 0; i < winSlots; i++) {
      segments.push(giftSegment);
      for(let j = 0; j < loseSlotsPerWinSlots; j++) {
        segments.push(noWinSegments[j % noWinSegments.length]);
      }
      Utils.shuffle(noWinSegments);
    }
    ret.segments = Utils.shuffle(segments);
    return ret;
  };

  private setupAttractions(sounds: string[]) {
    let config: AccountConfiguration = this.account.properties.configuration;
    this.showJokes = Utils.isStringBooleanTrue(config.SHOW_JOKES_ON_THANK_YOU_PAGE) || this.showJokes;
    if (this.showJokes) {
      setTimeout(()=>{
        this.setupImageHandling();
      }, 50);
    }
    this.showWheel = Utils.isStringBooleanTrue(config.SWEEPSTAKES_SHOW_WHEEL) || this.showWheel;
    if (this.shouldOfferWheel) {
      sounds.push(ThanksComponent.playSounds[0]/*Utils.randomElement(ThanksComponent.playSounds)*/);
      this.costPerUse = +config.SWEEPSTAKES_COST_PER_USE || 1;
      this.award = +config.SWEEPSTAKES_AWARD_AMOUNT || 5;
      this.giftMessage = ["$", this.award, ' Gift Card!'].join('');
      this.wheelOptions = ThanksComponent.getDefaultOptions(this.giftMessage, this.costPerUse,this.award);
    }
  }

  //TODO Implement this properly for fractional values.
  private static getSuccessAndTotalOutcomeIntegers(costPerUse: number, award: number) {
    return {
      costPerUse: costPerUse,
      award: award
    }
  }

  private setupMessagesAndAttractions(): Promise<any> {
    let isPromoterOrMiddle = (new AnyDetractors().execute(this.surveyNavigator, {}) == "false");
    let sounds: string[] = [];
    sounds.push(ThanksComponent.thanksSounds[0]/*Utils.randomElement(ThanksComponent.thanksSounds)*/);

    if (isPromoterOrMiddle) {
      this.setupAttractions(sounds);
    }

    let config: AccountConfiguration = this.account.properties.configuration;
    let speak = Utils.isStringBooleanTrue(config.SPEAK_GREETING)
    if (!speak) {
      return Promise.resolve();
    }
    setTimeout(()=>{
      this.showWheelModal();
    }, 8 * 1000);
    return DeviceServices.playAll(...sounds);
  }

  private initializeSoundsIfNecessary() {
    if (ThanksComponent.soundsInitialized) {
      return;
    }
    let allPaths = ThanksComponent.playSounds.concat(...ThanksComponent.thanksSounds);
    DeviceServices.preloadSimpleAll(...allPaths)
      .then(()=>{
        ThanksComponent.soundsInitialized = true;
        Utils.info("Preloaded sounds {0}", allPaths.join('   '));
      })
      .catch((err)=>{
        Utils.error("Could not preload audio files: {0}, err: {1}", allPaths.join('   '), err);
      })
  }

  private getFeedbackBenefitString() {
    return "Your feedback drives the changes we make everyday!";
  }
}
