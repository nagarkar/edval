/**
 * Created by chinmay on 2/24/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {ChartService, ChartDataResponse} from "../chart.service";
import {NavParams, AlertController} from "ionic-angular";
import {Component, ViewChild, ElementRef, Input} from "@angular/core";
import {BaseChartComponent} from "../base.chart.component";
import {AccountService} from "../../../services/account/delegator";
import {StaffService} from "../../../services/staff/delegator";
import {QueryUtils} from "../query.utils";
import {Formatters} from "../formatters";

declare let google;

@Component({
  selector: 'topinfluencertable',
  template: `
    <span style="padding:0.75em">How your patients rank factors (high to low) that affect '{{metricName}}'</span>
    <div class="border-around-text" #tableDiv></div>
    <div #errorDiv></div>
  `
})
export class TopInfluencersTable extends BaseChartComponent {

  @Input()
  metricName: string = 'Overall Favorability';

  @Input()
  promoterOrDetractor: boolean = true;

  @ViewChild("tableDiv")
  tableDiv: ElementRef;

  @ViewChild("errorDiv")
  errorDiv: ElementRef;

  constructor(alertCtrl: AlertController, svc: ChartService, asvc: AccountService, ssvc: StaffService, navParams: NavParams) {
    super(alertCtrl, svc, ssvc, asvc);
  }

  ngOnInit() {
    this.renderTopInflunencersOnFavorabilityDashboard(
      this.metricName,
      this.tableDiv.nativeElement,
      this.promoterOrDetractor)

      .catch((err)=>{
        let htmlEl: HTMLDivElement = this.errorDiv.nativeElement;
        //htmlEl.innerHTML = "<h6>"+ err + "</h6>";
      });
  }


  private renderTopInflunencersOnFavorabilityDashboard(metricName: string, dataTableDiv: HTMLDivElement, promoterOrDetractor: boolean ):  Promise<ChartDataResponse> {

    return this.renderInfluencers(
      QueryUtils.INFLUENCER_METRIC_QUERY(metricName, promoterOrDetractor),
      dataTableDiv,
      Object.assign(Formatters.standardOptions, {
        title:'Top Influencers on Staff Favorability',
        legend: {position: 'right', textStyle: {color: 'purple', fontSize: '1em'}}
      })
    );

  }
}
