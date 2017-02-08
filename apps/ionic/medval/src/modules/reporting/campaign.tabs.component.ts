/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Component, ViewChild} from "@angular/core";
import {CampaignReportComponent} from "./campaign.report.component";
import {Campaign} from "../../services/campaign/schema";
import {CampaignService} from "../../services/campaign/delegator";
import {Utils} from "../../shared/stuff/utils";
import {Tabs} from "ionic-angular";

@Component({
  selector: 'campaign-tabs',
  template: `    
    <ion-tabs #tabs class="campaigntabs">
      <ion-tab *ngFor="let campaign of campaigns; let idx = index;"
        [tabTitle]="campaign.properties.name" 
        [root]="components[idx]" [rootParams] = "{campaign:campaign}">
        <!--campaign-report [campaign]="campaign"></campaign-report-->
      </ion-tab>
    </ion-tabs>        
  `
})
export class CampaignTabsComponent {

  @ViewChild('tabs')
  tabs: Tabs;

  constructor(private campaignsvc: CampaignService) {

  }

  components: Function[] = [CampaignReportComponent]

  campaigns: Campaign[] = [];

  ngOnInit() {
    this.getCampaigns();
  }

  getCampaigns(): void {
    this.campaignsvc.list().then((campaigns: Campaign[])=>{
      this.campaigns = campaigns;
      this.components = new Array<Function>(this.campaigns.length);
      this.components.fill(CampaignReportComponent);
      setTimeout(()=>{
        this.tabs.select(0);
      }, 50)

    })
    .catch((err)=>{
      Utils.error(err);
    })
  }
}
