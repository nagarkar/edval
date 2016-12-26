import {Component, AfterViewChecked, AfterViewInit} from '@angular/core';

import { NavController} from 'ionic-angular';
import {Config} from "../../../shared/aws/config";
import {StartComponent} from "../start/start.component";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {MedvalComponent} from "../../../shared/stuff/medval.component";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {RegisterComponent} from "../../../services/survey/survey.navigator";

import {Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../shared/components/validator/validation.service';

@Component({
  templateUrl: 'handle.complaint.component.html',
})

@RegisterComponent
export class HandleComplaintComponent {
  emailProviders: string[] = [];
  emailProvidersOrg:string[]= ['@gmail.com','@yahoo.com','@mail.com','@outlook.com'];
  public complaintMsg: string;
  public user:any;

  constructor(
    tokenProvider: AccessTokenService,
    private sessionSvc: SessionService,
    private navCtrl: NavController,
    private utils: Utils,
    private formBuilder: FormBuilder
  ) {
     this.user = this.formBuilder.group({
      email: ['', ],
      tel: ['', Validators.compose([ValidationService.phoneValidator])],
      complaintMsg: ['', ]
    });
  }

  public navigateToNext() {
    SurveyNavUtils.navigateOrTerminate(
      this.sessionSvc.surveyNavigator,
      this.navCtrl,
      this.utils,
      "We're sorry if had a bad experience",
      "The folks at Orthodontic Excellence want to do better",
      "Rest assured that your feedback, although nameless, will help");
  }
}
