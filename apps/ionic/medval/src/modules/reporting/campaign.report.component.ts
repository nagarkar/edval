/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Campaign, SummaryMetrics} from "../../services/campaign/schema";
import {Metric} from "../../services/metric/schema";

@Component({
  selector: 'campaign-report',
  template: `
    <ion-content>
    <campaign-summary class="block t-1 pos-rel" [summary]="campaign.statistics.summary"></campaign-summary>

    <ion-slides [loop]="true" autoplay="{{10*1000}}" pager style="height: auto !important;">
      <ion-slide>
        <div style="top:0em;border-width: .5em" class="m-t-2 flex pos-rel horizontal-center border-around-text">
          <div style="position: absolute; top: 0em;">Organization Wide Scores</div>
          <role-summary padding *ngFor="let metrics of orgMetrics" class="flex vertical-center horizontal-center" [metrics]="metrics">     
          </role-summary>
        </div>
      </ion-slide>
      <ion-slide>
        <div style="top:0em;border-width: .5em" class="m-t-2 flex pos-rel horizontal-center border-around-text">
          <div style="position: absolute; top: 0em;">Top Line Average Scores by Role</div>
          <role-summary padding *ngFor="let metrics of roleMetrics" class="flex vertical-center horizontal-center" [metrics]="metrics">     
          </role-summary>
        </div>
      </ion-slide>
      <ion-slide>
        <div style="top:0em;border-width: .5em" class="m-t-2 flex pos-rel horizontal-center border-around-text">
          <div style="position: absolute; top: 0em;">Top Line Average Scores by Staff</div>
          <role-summary padding *ngFor="let metrics of staffMetrics" class="flex vertical-center horizontal-center" [metrics]="metrics">     
          </role-summary>
        </div>
      </ion-slide>
    </ion-slides>
    <!--
    <div class="m-t-2 flex pos-rel horizontal-center">
      <div class="border-around-text" *ngIf="orgMetrics.length > 0">Organization Wide
        <role-summary padding *ngFor="let metrics of orgMetrics" class="flex vertical-center horizontal-center" [metrics]="metrics">     
        </role-summary>
      </div>
      <div class="border-around-text" *ngIf="roleMetrics.length > 0">Roles
        <role-summary padding *ngFor="let metrics of roleMetrics" class="flex vertical-center horizontal-center" [metrics]="metrics">     
        </role-summary>
      </div>
      <div class="border-around-text" *ngIf="staffMetrics.length > 0">Staff
        <role-summary padding *ngFor="let metrics of staffMetrics" class="flex vertical-center horizontal-center" [metrics]="metrics">     
        </role-summary>
      </div>
    </div>
    -->
    </ion-content>
  `
})
export class CampaignReportComponent {

  campaign: Campaign;
  orgMetrics: SummaryMetrics[] = [];
  staffMetrics: SummaryMetrics[] = [];
  roleMetrics: SummaryMetrics[] = [];

  constructor(navParams: NavParams) {
    this.campaign = navParams.get('campaign');
    this.campaign.statistics.metrics.forEach((metric: SummaryMetrics)=>{
      if (Metric.isOrgSubject(metric.metricSubject)) {
        this.orgMetrics.push(metric);
      }
      if (Metric.isRoleSubject(metric.metricSubject)) {
        this.roleMetrics.push(metric);
      }
      if (Metric.isStaffSubject(metric.metricSubject)) {
        this.staffMetrics.push(metric);
      }
    })
  }
}
