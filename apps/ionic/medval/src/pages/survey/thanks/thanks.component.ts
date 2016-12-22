import {Component, AfterViewChecked, AfterViewInit, trigger, animate, transition, state, style} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {Config} from "../../../shared/aws/config";
import {StartComponent} from "../start/start.component";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {MedvalComponent} from "../../../shared/stuff/medval.component";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {StartWithSurveyOption} from "../startWithSurveyOption/start.with.survey.option.component";
import {ObjectCycler} from "../../../shared/stuff/object.cycler";

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

  message: string[];
  private jokes: string[] = [
    "assets/img/joke1.gif",
    "assets/img/joke2.png",
    "assets/img/joke3.jpg",
    "assets/img/joke4.jpg",
    "assets/img/joke5.jpg",
    "assets/img/joke6.jpg",
  ];
  joke: string = this.jokes[0];
  //imgState: string = "0";

  constructor(
    tokenProvider: AccessTokenService,
    private sessionService: SessionService,
    navCtrl: NavController,
    navParams: NavParams,
    utils: Utils
    ) {
    super(tokenProvider, navCtrl, utils);
    this.message = navParams.get('message');
    if (!this.message || this.message.length == 0) {
      this.message = ['Thanks for your feedback!'];
    }
    if (typeof this.message === 'string'){
      this.message = [<string>this.message];
    }
    if (this.message.length < 2) {
      new ObjectCycler<string>(Config.TIME_OUT_AFTER_SURVEY/2, ...this.jokes)
        .onNewObj.subscribe((next:string) => { this.joke = next; /*this.imgState = this.jokes.indexOf(next).toString()*/});
    }
    if (sessionService.hasCurrentSession()) {
      sessionService.closeCurrentSession();
    }
  }

  public restartSurvey() {
    this.utils.push(this.navCtrl, StartWithSurveyOption);
  }

  public ngAfterViewInit() {
    setTimeout(()=> {
      this.restartSurvey();
    }, Config.TIME_OUT_AFTER_SURVEY)
  }
}
