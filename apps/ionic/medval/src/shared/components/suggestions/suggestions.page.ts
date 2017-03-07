import {Component} from "@angular/core";
import {NavController, ToastController, ViewController} from "ionic-angular";
import {AdminComponent} from "../../../pages/admin.component";
import {Suggestion} from "../../aws/dynamodb";
import {AwsClient} from "../../aws/aws.client";
import {Utils} from "../../stuff/utils";
import {Http} from "@angular/http";
/**
 * Created by chinmay on 3/5/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

@Component({
  template: `
    <ion-content padding>
      <ion-list>
        <ion-item>
          <ion-label stacked>Your suggestion or comments</ion-label>
          <ion-textarea [(ngModel)]="suggestion.suggestion" rows="3" class="feedback-text"></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-label stacked>Preferred Email or Phone number</ion-label>
          <ion-input [(ngModel)]="suggestion.contactMethod"></ion-input>
        </ion-item>
        <ion-item>
          <button padding (tap)="submit()" ion-button>Submit</button>
        </ion-item>
        <ion-item>
          <ion-label>For urgent issues, contact <a href="mailto:admin@healthcaretech.io?Subject=Urgent%20Issue">admin@healthcaretech.io</a></ion-label> 
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  selector: 'suggestion'
})
export class SuggestionComponent extends AdminComponent {

  suggestion: Suggestion = new Suggestion();

  constructor(navCtrl: NavController, http: Http, private toastCtrl: ToastController, private viewCtrl: ViewController){
    super(navCtrl, http)
  }

  submit() {
    AwsClient.putSuggestion(this.suggestion)
      .catch((err)=>{
        Utils.presentTopToast(this.toastCtrl, err);
        this.viewCtrl.dismiss();
      })
      .then(()=>{
        this.viewCtrl.dismiss();
      });
  }
}
