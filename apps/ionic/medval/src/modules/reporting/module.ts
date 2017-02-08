/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
import {CampaignTabsComponent} from "./campaign.tabs.component";
import {CampaignSummaryComponent} from "./campaign.summary.component";
import {NgModule} from "@angular/core";
import {CampaignReportComponent} from "./campaign.report.component";
import {RevvolveCommonModule} from "../../shared/revvolve.common.module";
import {SubjectSummaryComponent} from "./subject.summary";
import {ChartComponent} from "./chart.component";

@NgModule({
  imports: [CommonModule, IonicModule, RevvolveCommonModule],
  exports: [CampaignTabsComponent],
  declarations: [CampaignTabsComponent, CampaignSummaryComponent, CampaignReportComponent, SubjectSummaryComponent, ChartComponent],
  entryComponents:[CampaignTabsComponent, CampaignReportComponent, ChartComponent]
})
export class ReportingModule {

}
