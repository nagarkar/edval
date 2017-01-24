import {CommonModule} from "@angular/common";
import {IonicModule} from "ionic-angular";
import {CampaignTabsComponent} from "./campaign.tabs.component";
import {CampaignSummaryComponent} from "./campaign.summary.component";
import {NgModule} from "@angular/core";
import {CampaignReportComponent} from "./campaign.report.component";
import {RevvolveCommonModule} from "../../shared/revvolve.common.module";
import {SubjectSummaryComponent} from "./subject.summary";

@NgModule({
  imports: [CommonModule, IonicModule, RevvolveCommonModule],
  exports: [CampaignTabsComponent],
  declarations: [CampaignTabsComponent, CampaignSummaryComponent, CampaignReportComponent, SubjectSummaryComponent],
  entryComponents:[CampaignTabsComponent, CampaignReportComponent]
})
export class ReportingModule {

}
