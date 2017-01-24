import {Component} from "@angular/core";
import {CampaignReportComponent} from "./campaign.report.component";
import {Campaign} from "../../services/campaign/schema";

@Component({
  selector: 'campaign-tabs',
  template: `    
    <ion-tabs class="campaigntabs">
      <ion-tab style="overflow:scroll" *ngFor="let campaign of campaigns; let idx = index;"
        tabIcon="water"  [tabTitle]="campaign.properties.name" 
        [root]="components[idx]" [rootParams] = "{campaign:campaign}">
        <!--campaign-report [campaign]="campaign"></campaign-report-->
      </ion-tab>
    </ion-tabs>        
  `
})
export class CampaignTabsComponent {

  components: Function[] = []

  campaigns: Campaign[] = [];

  ngOnInit() {
    this.getCampaigns();
  }

  getCampaigns(): void {
    this.campaigns = [
      new Campaign('default', 'Default Campaign'),
      new Campaign('234', 'Second Campaign')
    ];
    this.campaigns.forEach((campaign)=>{
      let stats = campaign.statistics;
      stats.summary = {
        prior30daysSessions:10,
        last30daysSessions:12,
        totalSessions:100,
        dateOfFirstFeedback: [2014, 3, 15],
        dateOfLastFeedback: [2017, 0, 15]
      };
      stats.metrics = [{
        metricSubject:'role:Orthodontic Assistant',
        currentWindowStats: {
          mean:0.5,
          frequencies: {
            detractor: .04,
            promoter: .04
          }
        },
        previousWindowStats: {
          mean:0.5,
          frequencies: {
            detractor: .03,
            promoter: .05
          }
        }
      },
      {
        metricSubject:'role:DDS',
        currentWindowStats: {
          mean:0.5,
          frequencies: {
            detractor: .04,
            promoter: .04
          }
        },
        previousWindowStats: {
          mean:0.5,
          frequencies: {
            detractor: .03,
            promoter: .05
          }
        }
      },
        {
          metricSubject:'role:DDS',
          currentWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .04,
              promoter: .04
            }
          },
          previousWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .03,
              promoter: .05
            }
          }
        },
        {
          metricSubject:'role:DDS',
          currentWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .04,
              promoter: .04
            }
          },
          previousWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .03,
              promoter: .05
            }
          }
        }];
    })
    this.components = new Array<Function>(this.campaigns.length);
    //this.components[0] = ;
    //this.components[1] = CampaignReportComponent;
    this.components.fill(CampaignReportComponent);
  }
}
