/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component} from "@angular/core";
import {CampaignService} from "../../services/campaign/delegator";


@Component({
  template: `
    <mdval-header title="Performance Dashboard"></mdval-header>
    
      <div class="m-t-4" padding style="color:white">
        <campaign-tabs></campaign-tabs>
      </div>
    
  `,
})
export class ReportingDashboard {

  constructor(private campaignsvc: CampaignService) {

  }

  ngOnInit() {
    if (this.campaignsvc.inMockMode()) {
      setTimeout(()=> {
        alert('This is a demonstration page. It is not pulling real data.')
      }, 1000);
    }
  }
}
