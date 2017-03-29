/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, Input, OnInit, OnDestroy, ViewChild, ElementRef} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {LoginComponent} from "../../login/login.component";
import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {SessionService} from "../../../services/session/delegator";
import {SurveyService} from "../../../services/survey/delegator";
import {ThanksComponent} from "../thanks/thanks.component";
import {ImageCycler, SoundCycler} from "../../../shared/stuff/object.cycler";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {Survey} from "../../../services/survey/schema";
import {NativeAudio} from "ionic-native";
import {Http} from "@angular/http";
import {AccountService} from "../../../services/account/delegator";
import {Config} from "../../../shared/config";
import {AnyComponent} from "../../any.component";

@Component({
  templateUrl: './start.with.survey.option.component.html'
})

export class StartWithSurveyOption extends AnyComponent implements OnInit, OnDestroy {

  private static imageCycler: ImageCycler;
  private static imageTimerHandle: number;

  private static soundCycler: SoundCycler;
  private static soundTimerHandle: number;


  leftImage: string;// = StartWithSurveyOption.cycler.currentImage.src;

  surveys : Survey[] = [];

  cancelPreviousSession: boolean;

  @ViewChild("imgDiv")
  imgDiv: ElementRef;

  @Input()
  defaultOnly: boolean = false; // must default to false in order for logic in constructor to work

  constructor(
    private http: Http,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    utils: Utils,
    private tokenProvider: AccessTokenService,
    private surveySvc: SurveyService,
    private sessionSvc: SessionService,
    private accountSvc: AccountService,
    navParams: NavParams
  ) {

    super();
    this.defaultOnly = navParams.get("defaultOnly") === true || this.defaultOnly;
    this.cancelPreviousSession = navParams.get("cancelPreviousSession") || this.cancelPreviousSession;
  }

  ngOnInit() {
    Utils.logoutIfNecessary(this.navCtrl, this.http);
    this.surveySvc.list().then((surveys: Survey[]) => {
      this.surveys = surveys;
      this.surveys.filter((survey: Survey)=> {
        return survey.id == 'default';
      })
    });
    this.clearTimerHandles();
    this.setupImageHandling();
    this.setupSoundHandling();
  }

  ngOnDestroy(){
    this.clearTimerHandles();
  }

  gotoLogin() {
    Utils.setRoot(this.navCtrl, LoginComponent);
  }

  noThanks() {
    Utils.setRoot(this.navCtrl, ThanksComponent, {message: ["That's ok, maybe next time!"]});
  }

  pickSurvey(id: string){
    if (this.sessionSvc.hasCurrentSession() && !this.cancelPreviousSession) {
      try {
        this.sessionSvc.closeCurrentSession();
      } catch(err) {
        Utils.presentTopToast(this.toastCtrl, err || err.message);
      }
    }
    this.sessionSvc.newCurrentSession(id);
    this.sessionSvc.scratchPad['defaultOnly'] = this.defaultOnly;
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl);
  }

  private setupImageHandling() {
    this.createImageCyclerIfNecessary();
    let cycler = StartWithSurveyOption.imageCycler;
    let setImage = (next: HTMLImageElement) => {
      let div: HTMLDivElement = this.imgDiv.nativeElement;
      div.removeChild(div.children.item(0));
      div.appendChild(next);
    }
    setImage(cycler.currentObject);
    StartWithSurveyOption.imageTimerHandle = setInterval(()=>{
      let next: HTMLImageElement = cycler.currentObject;
      setImage(next);
    }, 15 * 1000);
  }

  private setupSoundHandling() {
    let account = this.accountSvc.getCached(Config.CUSTOMERID);
    let intervalMinutes = 1;
    if (account && account.properties && account.properties.configuration) {
      intervalMinutes = account.properties.configuration.CHIME_INTERVAL;
    }
    this.createSoundCyclerIfNecessary(intervalMinutes);
    let cycler = StartWithSurveyOption.soundCycler;
    StartWithSurveyOption.soundTimerHandle = setInterval(()=> {
      let id = cycler.currentObject;
      NativeAudio.play(id, ()=> {} /* Nothing to do on completion */)
        .then(()=> {
          Utils.info("Played sound {0}", id);
        })
        .catch((err)=> {
          Utils.error("Unable to play sound {0}, due to {1}", id, err);
        })
    }, (intervalMinutes || 1) * 60 * 1000);
  }

  private createSoundCyclerIfNecessary(intervalMinutes: number) {
    if (!StartWithSurveyOption.soundCycler) {
      StartWithSurveyOption.soundCycler = new SoundCycler(
        (intervalMinutes || 1) * 60 * 1000, // 10 minutes
        'assets/mp3/bingbong.mp3',
        'assets/mp3/coindrop.mp3',
        'assets/mp3/game_sound1.mp3',
        'assets/mp3/game_sound2.mp3',
        'assets/mp3/servicebell.mp3',
      );
    }
  }

  private createImageCyclerIfNecessary() {
    if (!StartWithSurveyOption.imageCycler) {
      StartWithSurveyOption.imageCycler = new ImageCycler(
        503, 650,
        // {webkitTransform: "translate3d(0, 0, 0);", transform: "translate3d(0, 0, 0)", position:"relative", bottom:"-1em"},
        "-webkit-transform: translate3d(0, 0, 0);transform: translate3d(0, 0, 0);position:relative; bottom:-1em",
        null,
        'https://s3.amazonaws.com/revvolveapp/quotes/quote1.jpg',
        'https://s3.amazonaws.com/revvolveapp/quotes/quote2.jpg',
        'https://s3.amazonaws.com/revvolveapp/quotes/quote3.jpg',
        'https://s3.amazonaws.com/revvolveapp/quotes/quote1.jpg',
        'https://s3.amazonaws.com/revvolveapp/quotes/quote4.jpg',
        'https://s3.amazonaws.com/revvolveapp/quotes/quote1.jpg',
        'https://s3.amazonaws.com/revvolveapp/quotes/quote5.jpg',
        'https://s3.amazonaws.com/revvolveapp/quotes/quote2.jpg',
      );
    }
  }

  private clearTimerHandles() {
    if (StartWithSurveyOption.imageTimerHandle) {
      clearInterval(StartWithSurveyOption.imageTimerHandle);
    }
    if (StartWithSurveyOption.soundTimerHandle) {
      clearInterval(StartWithSurveyOption.soundTimerHandle);
    }
  }
}
