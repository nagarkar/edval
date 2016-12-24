import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {RegisterComponent} from "../../../services/survey/survey.navigator";

@Component({
  templateUrl: 'handle.complaint.component.html',
})

@RegisterComponent
export class HandleComplaintComponent {

  private images: string[] = [
    "http://www.nicephotomag.com/wp-content/uploads/2009/06/uniracer_2009_0409_1435_20_149.jpg",
    "https://s-media-cache-ak0.pinimg.com/236x/eb/ac/c2/ebacc2789ff96ca7aafe6c855b6a8e1a.jpg",
    "http://i.dailymail.co.uk/i/pix/2011/04/14/article-1376796-0B9F664100000578-491_634x467.jpg",
    "http://cdn.alex.leonard.ie/wp-content/uploads/2013/02/extreme-mountain-unicycling.jpg"
  ];
  complaintMsg: string;
  image: string = this.images[0];

  constructor(
    tokenProvider: AccessTokenService,
    private sessionSvc: SessionService,
    private navCtrl: NavController,
    private utils: Utils
  ) {
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
