/**
 * Created by chinmay on 2/24/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {BaseChartComponent} from "../base.chart.component";
import {ChartService} from "../chart.service";
import {Campaign} from "../../../services/campaign/schema";
import {Input, ElementRef, ViewChild, Component} from "@angular/core";
import {CampaignService} from "../../../services/campaign/delegator";
import {AccountService} from "../../../services/account/delegator";
import {StaffService} from "../../../services/staff/delegator";
import {MetricAndSubject} from "../metric.subject";
import {QueryUtils} from "../query.utils";

@Component({
  selector: 'campaign-summary',
  templateUrl: 'campaign.summary.component.html'
})
export class CampaignSummaryComponent extends BaseChartComponent {

  campaign: Campaign;

  @Input()
  metricAndSubjects: Array<MetricAndSubject> = [];

  @ViewChild('tableDiv')
  tableDiv: ElementRef;

  constructor(svc: ChartService, asvc: AccountService, ssvc: StaffService, campaignService: CampaignService){
    super(svc, ssvc, asvc);
    this.campaign = campaignService.getCached(Campaign.DEFAULT_CAMPAIGN_ID);
  }

  ngOnInit(){
    let options = {
      title: 'Summary of Metrics'
    }
    super.renderTable(QueryUtils.CAMPAIGN_METRICS_QUERY(), this.tableDiv.nativeElement, options);
  }
}
