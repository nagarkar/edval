import {Component, Input} from "@angular/core";
import {ReportingSummary} from "../../services/campaign/schema";

@Component({
  selector: 'campaign-summary',
  template: `
    <div class="m-t-4" padding>
    <ion-grid>
      <ion-row wrap>
        <ion-col width-33 class="border-around-text">
          <ion-label><b>What's covered in this campaign</b></ion-label>
          The default campaign covers all the measurements across your practice
        </ion-col>
        <ion-col class="border-around-text">
          <ion-grid>
            <ion-row class="separator-bottom">
            <ion-col width-67><b># of Feedback Surveys Received in lifetime</b></ion-col>
            <ion-col>{{summary.totalSessions}}</ion-col>
            </ion-row>
            <ion-row>
              <ion-col width-67><b>Date of First Feedback</b></ion-col>
              <ion-col>{{summary.dateOfFirstFeedback | date}}</ion-col>
            </ion-row>
            <ion-row class="separator-bottom">
              <ion-col width-67><b>Date of Last Feedback</b></ion-col>
              <ion-col>{{summary.dateOfLastFeedback | date}}</ion-col>
            </ion-row>
            <ion-row>
              <ion-col width-67><b># of Feedback Surveys in last 30 days</b></ion-col>
              <ion-col>{{summary.lastWindowSessionCount}}</ion-col>
            </ion-row>            
            <ion-row>
              <ion-col width-67><b># of Surveys in previous 30 day period</b></ion-col>
              <ion-col>{{summary.priorWindowSessionCount}}</ion-col>
            </ion-row>
            <ion-row>
              <ion-col width-67><b>Feedback Trend {{summary.last30dayTrend > 0 ? '(Up)' : '(Down)'}}</b></ion-col>
              <ion-col>{{summary.last30dayTrend*100}}%</ion-col>
            </ion-row>
          </ion-grid>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
  `
})

export class CampaignSummaryComponent {

  @Input()
  summary: ReportingSummary = new ReportingSummary();
}
