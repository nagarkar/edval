import {Component, Input} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {NavParams} from "ionic-angular";
import {Campaign, ReportingSummary} from "../../services/campaign/schema";

@Component({
  selector: 'campaign-report',
  template: `
    <campaign-summary class="block t-3 pos-rel" [summary]="campaign.statistics.summary"></campaign-summary>
    <div class="m-t-8 flex pos-rel vertical-center horizontal-center b-6">
      <role-summary padding *ngFor="let metrics of campaign.statistics.metrics" class="flex vertical-center horizontal-center" [metrics]="metrics">     
      </role-summary>
    </div>
  `
})
export class CampaignReportComponent {

  campaign: Campaign;

  constructor(navParams: NavParams) {
    this.campaign = navParams.get('campaign');
  }
}
