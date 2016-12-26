import {Component, AfterViewInit, trigger, animate, transition, state, style} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Config} from "../../../shared/aws/config";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {MedvalComponent} from "../../../shared/stuff/medval.component";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {StartWithSurveyOption} from "../startWithSurveyOption/start.with.survey.option.component";
import {ObjectCycler} from "../../../shared/stuff/object.cycler";
import {SReplacer} from "../../../pipes/SReplacer";
import {AccountService} from "../../../services/account/delegator";

@Component({
  templateUrl: 'thanks.component.html',
  animations: [
    trigger('imgState', [
      state("0", style({transform: 'scale(1)'})),
      state("1", style({transform: 'scale(1)'})),
      transition('0 => 1', animate('1000ms ease-in'))
    ])
  ]
})
export class ThanksComponent extends MedvalComponent implements AfterViewInit {

  whatToShow: string = "joke";
  showWheel: boolean = false;
  showJokes: boolean = true;

  message: string[];
  jokes: string[] = [
    "https://s-media-cache-ak0.pinimg.com/236x/bb/ae/34/bbae349eb7742a734090c978e2058d0c.jpg",
    "http://www.columbia.edu/~jjp29/images/fit40.gif",
    "https://s-media-cache-ak0.pinimg.com/564x/cf/fc/58/cffc58e0f00918f82b8d322d028a843c.jpg",
    "http://buzzxtra.com/wp-content/uploads/2016/07/funny-dentist-statistic-662x998-662x998_c.jpg",
    "https://s3.amazonaws.com/lowres.cartoonstock.com/sport-basketball-games-destinies-dentist-dental-smb090602_low.jpg",
    "https://s-media-cache-ak0.pinimg.com/236x/d2/31/7b/d2317bdc68ef52605828f89b2a0b09d7.jpg",
    "https://s-media-cache-ak0.pinimg.com/originals/3f/a0/3e/3fa03e3e8a0c0f51f238d25a5f5021e8.jpg",
    "http://www.columbia.edu/~jjp29/images/fit33.gif",
    "http://www.columbia.edu/~jjp29/images/fit34.gif",
    "http://www.columbia.edu/~jjp29/images/fit43.gif",
    "http://lefunny.net/wp-content/uploads/2014/01/Funny-dentist-drawing.jpg",
    "https://s3.amazonaws.com/lowres.cartoonstock.com/animals-dentist-tooth-toothcare-tooth_care-clean_teeth-gra070703_low.jpg",
    "http://www.you-can-be-funny.com/images/exwifesattorney.jpg",
    "http://img1.joyreactor.com/pics/post/dentist-flossing-poorly-drawn-lines-comics-2915269.png",
    "https://thumbs.dreamstime.com/z/know-your-strengths-person-thinking-special-skills-words-wondering-what-his-unique-abilities-to-give-him-38797579.jpg"
  ];
  joke: string = this.jokes[0];
  //imgState: string = "0";

  wheelOptions: any;
  costPerUse: number;
  award: number;
  giftMessage: string;

  constructor(
    tokenProvider: AccessTokenService,
    private sessionService: SessionService,
    accountSvc: AccountService,
    navCtrl: NavController,
    navParams: NavParams,
    utils: Utils
    ) {
    super(tokenProvider, navCtrl, utils);
    this.message = navParams.get('message');
    this.processMessage(accountSvc);

    let wfProperties = sessionService.surveyNavigator.survey.workflowProperties;
    this.showJokes = wfProperties.showJokes || false;
    this.showWheel = wfProperties.showWheel || false;
    if (this.showWheel) {
      this.costPerUse = +wfProperties.costPerUse || 1;
      this.award = +wfProperties.award || 5;
      this.giftMessage = ["$", this.award, ' Gift Card!'].join('');
      this.wheelOptions = ThanksComponent.getDefaultOptions(this.giftMessage, this.costPerUse,this.award);
    }
  }

  ngOnDestroy() {
    if (this.sessionService.hasCurrentSession()) {
      this.sessionService.closeCurrentSession();
    }
  }

  public restartSurvey() {
    this.ngOnDestroy();
    this.utils.push(this.navCtrl, StartWithSurveyOption);
  }

  public ngAfterViewInit() {
    setTimeout(()=> {
      this.restartSurvey();
    }, Config.TIME_OUT_AFTER_SURVEY)
  }

  showWheelMessage() {

  }

  static getDefaultOptions(giftMessage: string, costPerUse: number, award: number): any {

    let giftSegment = {'fillStyle' : '#eae56f', 'text': giftMessage};
    let noWinSegments = [
      {'fillStyle' : '#89f26e', 'text' : 'No Luck'},
      {'fillStyle' : '#7de6ef', 'text' : 'Another time'},
      {'fillStyle' : '#e7706f', 'text' : 'Not this time'},
      {'fillStyle' : '#eae56f', 'text' : 'No Deal!'},
      {'fillStyle' : '#eae56f', 'text' : 'Try next time!'},
    ];

    //costPerUse  = winSlots * award/totalSlots;
    let loseSlotsPerWinSlots = Math.ceil(award/costPerUse - 1);
    let winSlots = Math.floor(50/(1+loseSlotsPerWinSlots));

    Utils.shuffle(noWinSegments);
    let ret: any = {
      'numSegments': 15,   // Specify number of segments.
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
      for(let j = 0; i < loseSlotsPerWinSlots; i++) {
        segments.push(noWinSegments[j % noWinSegments.length]);
      }
    }
    ret.segments = Utils.shuffle(segments);
  };

  private processMessage(accountSvc: AccountService) {
    if (!this.message || this.message.length == 0) {
      this.message = ["'Thanks for your feedback!'"];
    }
    if (typeof this.message === 'string'){
      this.message = [<string>this.message];
    }
    if (this.message.length < 2) {
      new ObjectCycler<string>(Config.TIME_OUT_AFTER_SURVEY/2, ...this.jokes)
        .onNewObj.subscribe((next:string) => { this.joke = next;});
    }
    let r = new SReplacer(accountSvc);
    this.message = this.message.map((value)=> {
      return r.transform(value);
    });

  }
}
