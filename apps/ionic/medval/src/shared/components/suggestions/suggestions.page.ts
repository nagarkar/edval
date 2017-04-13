import {Component} from "@angular/core";
import {ToastController, ViewController} from "ionic-angular";
import {Suggestion} from "../../aws/dynamodb";
import {AwsClient} from "../../aws/aws.client";
import {Utils} from "../../stuff/utils";
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
      <ion-list *ngIf="enableSuggestions">
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
          <ion-label>For urgent issues, contact <a id="1929993" href="mailto:questions@revvolve.io?Subject=Urgent%20Issue">questions@revvolve.io</a></ion-label> 
        </ion-item>
      </ion-list>
      <ion-label text-center normalwhitespace *ngIf="!enableSuggestions">
        Please contact <a id="1929993" href="mailto:questions@revvolve.io?Subject=Urgent%20Issue">questions@revvolve.io</a> if you have a suggestion, question or issue and we'll get back to you shortly.
      </ion-label>
    </ion-content>
  `,
  selector: 'suggestion'
})
export class SuggestionComponent  {

  suggestion: Suggestion = new Suggestion();

  enableSuggestions: boolean = false;

  constructor(private toastCtrl: ToastController, private viewCtrl: ViewController){
    this.enableSuggestions = !Utils.nou(AwsClient.DDB);
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
