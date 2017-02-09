/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, OnInit, OnDestroy} from "@angular/core";
import {NavController, NavParams, Modal, ModalController} from "ionic-angular";
import {Config} from "../../../shared/config";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {ObjectCycler} from "../../../shared/stuff/object.cycler";
import {AccountService} from "../../../services/account/delegator";
import {Idle} from "@ng-idle/core";
import {StartWithSurveyOption} from "../start/start.with.survey.option.component";
import {WheelComponent} from "../../../shared/components/wheel/wheel.component";
import {SurveyPage} from "../survey.page";
import {WorkflowProperties} from "../../../services/survey/schema";
import {AnyDetractors} from "../../../services/survey/survey.functions";

@Component({
  templateUrl: './thanks.component.html',
})
export class ThanksComponent extends SurveyPage implements OnInit, OnDestroy {

  whatToShow: string = "joke";
  showWheel: boolean = false;
  showJokes: boolean = true;

  message: string[];
  cycler: ObjectCycler<string>;
  jokes = Utils.shuffle([
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
  ]);
  joke: {} = this.jokes[0];

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
    private accountSvc: AccountService,
    protected navCtrl: NavController,
    private modalctrl: ModalController,
    navParams: NavParams) {

    super(navCtrl, sessionSvc, idle);

    this.message = this.constructMessage(navParams.get('message'));

  }

  ngOnInit() {
    let isPromoterOrMiddle = (new AnyDetractors().execute(this.sessionSvc.surveyNavigator, {}) == "false");

    if (isPromoterOrMiddle) {
      this.cycler = new ObjectCycler<string>(Config.TIME_PER_JOKE, ...this.jokes)
        .onNewObj.subscribe((next:string) => { this.joke = next;});
      this.setupAttractions();
    }
  }

  ngOnDestroy() {
    if (this.cycler) {
      this.cycler.ngOnDestroy();
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
    Config.LAST_SWEEPSTAKE_MILLIS = Date.now();
    this.idle.stop();
    let profileModal : Modal = this.modalctrl.create(WheelComponent, {options: this.wheelOptions});
    profileModal.onWillDismiss((data) => {
      this.showWheel = false;
      this.idle.watch();
    });
    profileModal.present();
    setTimeout(()=> {
      profileModal.dismiss();
      this.closeSession();
    }, Config.TIMEOUT_AFTER_SHOWING_YOU_WON_MESSAGE)

  }

  private closeSession() {
    this.sessionSvc.closeCurrentSession();
    Utils.setRoot(this.navCtrl, StartWithSurveyOption, {defaultOnly: true})
  }

  private constructMessage(input: any): string[] {
    if (!input || !input.length || input.length == 0) {
      return [
        "Thanks for your feedback!",
        "'Regular feedback from patients helps ' + account.properties.customerName + ' improve!'"
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
      chance: Utils.format("{0} in {1}", outcomes.costPerUse, outcomes.award)
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

  private setupAttractions() {
    let wfProperties: WorkflowProperties =
      this.sessionSvc.hasCurrentSession() ? this.sessionSvc.surveyNavigator.survey.workflowProperties: {avgSteps: 4};
    this.showJokes = wfProperties.showJokes || this.showJokes;
    this.showWheel = wfProperties.showWheel || this.showWheel;
    if (this.showWheel) {
      this.costPerUse = +wfProperties.costPerUse || 1;
      this.award = +wfProperties.award || 5;
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
}
