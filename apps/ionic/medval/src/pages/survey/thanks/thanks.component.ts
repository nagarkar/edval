import {Component, trigger, animate, transition, state, style} from "@angular/core";
import {NavController, NavParams, Modal, ModalController, AlertController} from "ionic-angular";
import {Config} from "../../../shared/config";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {ObjectCycler} from "../../../shared/stuff/object.cycler";
import {SReplacer} from "../../../pipes/SReplacer";
import {AccountService} from "../../../services/account/delegator";
import {Idle, DEFAULT_INTERRUPTSOURCES} from "@ng-idle/core";
import {Subject} from "rxjs";
import {StartWithSurveyOption} from "../start/start.with.survey.option.component";
import {WheelComponent} from "../../../shared/components/wheel/wheel.component";

@Component({
  templateUrl: 'thanks.component.html'
})
export class ThanksComponent {

  whatToShow: string = "joke";
  showWheel: boolean = false;
  showJokes: boolean = Config.SHOW_JOKES;

  message: string[];
  jokes: {}[] = Utils.shuffle([
    {url: "https://s-media-cache-ak0.pinimg.com/236x/bb/ae/34/bbae349eb7742a734090c978e2058d0c.jpg", style:{'height':'25em'}},
    {url: "http://www.columbia.edu/~jjp29/images/fit40.gif"},
    {url: "https://s-media-cache-ak0.pinimg.com/564x/cf/fc/58/cffc58e0f00918f82b8d322d028a843c.jpg", style:{'height':'25em'}},
    {url: "http://buzzxtra.com/wp-content/uploads/2016/07/funny-dentist-statistic-662x998-662x998_c.jpg", style:{'height':'25em'}},
    {url: "https://s3.amazonaws.com/lowres.cartoonstock.com/sport-basketball-games-destinies-dentist-dental-smb090602_low.jpg", style:{'height':'25em'}},
    {url: "https://s-media-cache-ak0.pinimg.com/236x/d2/31/7b/d2317bdc68ef52605828f89b2a0b09d7.jpg", style:{'height':'25em'}},
    {url: "https://s-media-cache-ak0.pinimg.com/originals/3f/a0/3e/3fa03e3e8a0c0f51f238d25a5f5021e8.jpg", style:{'width':'28em'}},
    {url: "http://www.columbia.edu/~jjp29/images/fit33.gif"},
    {url: "http://www.columbia.edu/~jjp29/images/fit34.gif"},
    {url: "http://www.columbia.edu/~jjp29/images/fit43.gif"},
    {url: "http://lefunny.net/wp-content/uploads/2014/01/Funny-dentist-drawing.jpg", style:{'width':'30em'}},
    {url: "https://s3.amazonaws.com/lowres.cartoonstock.com/animals-dentist-tooth-toothcare-tooth_care-clean_teeth-gra070703_low.jpg"},
    {url: "http://www.you-can-be-funny.com/images/exwifesattorney.jpg", style:{'width':'26em'}},
    {url: "http://img1.joyreactor.com/pics/post/dentist-flossing-poorly-drawn-lines-comics-2915269.png", style:{'width':'28em'}},
  ]);
  joke: {} = this.jokes[0];

  wheelOptions: any;
  costPerUse: number;
  award: number;
  giftMessage: string;

  constructor(
    private idle: Idle,
    private sessionSvc: SessionService,
    private accountSvc: AccountService,
    private navCtrl: NavController,
    private modalctrl: ModalController,
    navParams: NavParams,
    private utils: Utils
    ) {

    this.setupIdleTimeout();
    this.message = this.constructMessage(navParams.get('message'));
    if (this.message.length < 2) {
      new ObjectCycler<any>(Config.TIME_PER_JOKE, ...this.jokes)
        .onNewObj.subscribe((next:{}) => { this.joke = next;});
    }

    let wfProperties = sessionSvc.hasCurrentSession() ? sessionSvc.surveyNavigator.survey.workflowProperties: {};
    this.showJokes = wfProperties.showJokes || true;
    this.showWheel = wfProperties.showWheel || true;
    if (this.showWheel) {
      this.costPerUse = +wfProperties.costPerUse || 1;
      this.award = +wfProperties.award || 5;
      this.giftMessage = ["$", this.award, ' Gift Card!'].join('');
      this.wheelOptions = ThanksComponent.getDefaultOptions(this.giftMessage, this.costPerUse,this.award);
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
    this.idle.stop();
    setTimeout(()=> {
      this.closeSession();
    }, Config.TIMEOUT_AFTER_SHOWING_YOU_WON_MESSAGE)

    let profileModal : Modal = this.modalctrl.create(WheelComponent, {options: this.wheelOptions});
    profileModal.onWillDismiss((data) => {
      this.showWheel = false;
      Config.LAST_SWEEPSTAKE_MILLIS = Date.now();
      this.idle.watch();
    });
    profileModal.present();
  }


  private setupIdleTimeout() {
    this.idle.setIdle(Config.SURVEY_PAGE_IDLE_SECONDS);
    this.idle.setTimeout(Config.SURVEY_PAGE_TIMEOUT_SECONDS);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    let subscription: Subject<number> = this.idle.onTimeout.subscribe(() => {
      this.closeSession();
      subscription.unsubscribe();
    })
    this.idle.watch();
  }

  private closeSession() {
    if (this.sessionSvc.hasCurrentSession()) {
      this.sessionSvc.closeCurrentSession();
    }
    this.utils.setRoot(this.navCtrl, StartWithSurveyOption, {defaultOnly: true})
  }

  private constructMessage(input: any): string[] {
    if (!input || !input.length || input.length == 0) {
      return ["Thanks for your feedback!"];
    }

    let replacer = new SReplacer(this.accountSvc);
    if (typeof input === 'string'){
      return [replacer.transform(<string>input)];
    }
    return input.map((value)=> {
      return replacer.transform(value);
    });
  }

  private static getDefaultOptions(giftMessage: string, costPerUse: number, award: number): {} {

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

    let ret: any = {
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
    };
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
}
