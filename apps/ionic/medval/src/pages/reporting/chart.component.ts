/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {CampaignService} from "../../services/campaign/delegator";
import {MetricService} from "../../services/metric/delegator";
import {ChartService} from "./chart.service";
import {Utils} from "../../shared/stuff/utils";
import {QueryUtils} from "./query.utils";

declare var google;

@Component({
  selector: 'rev-chart',
  templateUrl: 'chart.component.html'
})
export class ChartComponent {

  private showTable: boolean;

  static colors: string[] = Utils.shuffle([
    'AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Plum','PowderBlue','RebeccaPurple','RosyBrown','RoyalBlue','Salmon','SeaGreen','SeaShell','Silver','SkyBlue','SlateBlue','SpringGreen','SteelBlue','Teal','Thistle','Turquoise','Violet','Wheat','WhiteSmoke','Yellow','YellowGreen'
  ]);
  //private monthFormat = new google.visualization.DateFormat({pattern: 'yyyy-MMMM'});
  private monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

  private standardOptions = {
    hAxis: {
      title: 'Time'
    },
    vAxis: {
      title: 'Rating', format: '#', ticks: [0, 1, 2, 3, 4, 5]
    },
    trendlines: {
      0: { type: 'linear', color: 'green', lineWidth: 3, opacity: 0.3, showR2: true, visibleInLegend: true}
    }
  }

  constructor(private campaignsvc: CampaignService, private metricsvc: MetricService, private svc: ChartService, navParams: NavParams) {
    this.showTable = true;
  }

  ngOnInit() {
    try {
      google.charts.load('current', { packages: ['corechart', 'controls', 'table'] });
      google.charts.setOnLoadCallback(this.initGraphs);
    } catch (err) {
      Utils.error(err);
    }
  }

  emailReport() {
    this.svc.postReportEmail("select * limit 5000", QueryUtils.CHART_DATA_REPORT, "report.tsv");
  }

  emailFavorabilityInfluencerReport() {
    this.svc.postReportEmail(
      `select datemonth, influencerMetric, sum(rank)
          where promoterOrDetractor=true
          group by datemonth, influencerMetric
          order by sum(rank) desc
          limit 5000`,
      QueryUtils.INFLUENCERS_REPORT,
      "report.tsv");
  }

  private createNewYearSlider = (divId)=> {
    return new google.visualization.ControlWrapper({
      controlType: 'DateRangeFilter',
      containerId: divId,
      options: {
        filterColumnIndex: 0,
        ui: {
          labelStacking: 'vertical',
          format: {pattern: 'yyyy-MMMM'}
        }
      }
    });
  }

  private createRoleCategoryFilter = (divId, values)=> {
    return new google.visualization.ControlWrapper({
      controlType: 'CategoryFilter',
      containerId: divId,
      state: {
        selectedValues: [values[0]]
      },
      options: {
        filterColumnIndex: 1,
        ui: {
          labelStacking: 'vertical'
        },
        values: values,
        allowNone: false,
        allowMultiple: false,
      }
    });
  }

  private initGraphs = () : void  => {
    let chart;

    this.renderTopInflunencersOnFavorabilityDashboard('Overall Favorability', 'topInfluencers1', true);
    //this.renderTopInflunencersOnFavorabilityDashboard('Overall Favorability', 'topInfluencers2', false);

    this.renderTopInflunencersOnFavorabilityDashboard('Favorability - Doctors', 'topInfluencers3', true);
    //this.renderTopInflunencersOnFavorabilityDashboard('Favorability - Doctors', 'topInfluencers4', false);

    this.renderTopInflunencersOnFavorabilityDashboard('Favorability - Assistants', 'topInfluencers5', true);
    //this.renderTopInflunencersOnFavorabilityDashboard('Favorability - Assistants', 'topInfluencers6', false);

    this.renderTopInflunencersOnFavorabilityDashboard('Favorability - Frontoffice', 'topInfluencers7', true);
    //this.renderTopInflunencersOnFavorabilityDashboard('Favorability - Frontoffice', 'topInfluencers8', false);



    this.renderOrgDashboard();

    this.renderStaffDashboard('jaite', 'celeron');

    this.renderRoleDashboard('DDS', 'Orthodontic Assistant', 'FrontOffice');

    this.renderDrilldownMetricsByRoleDashboard('DDS', 'Orthodontic Assistant', 'FrontOffice');

    this.renderDrilldownMetricsByStaffDashboard('jaite', 'celeron');

    if (this.showTable) {
      chart = new google.visualization.ChartWrapper({
        'chartType':'Table',
        'dataSourceUrl': this.svc.getReportUrl(QueryUtils.CHART_DATA_REPORT),
        'containerId':'allData',
        'query':"select *",
        'options': {'title':'All Data', 'legend':'none'}
      });
      chart.draw();
    }

    chart = new google.visualization.ChartWrapper({
      'chartType':'LineChart',
      'dataSourceUrl': this.svc.getReportUrl(QueryUtils.CHART_DATA_REPORT),
      'containerId':'metricBreakdown',
      'query':"select subjectvalue, avg(value) where subjecttype = 'staff' and parentMetricId <> '' group by subjectvalue",
      'options': {'title':'Staff Favorability', 'legend':'none'}
    });
    chart.draw();

    google.visualization.drawToolbar(document.getElementById('toolbar'), [{
      type: 'csv',
      datasource: this.svc.getReportUrl(QueryUtils.CHART_DATA_REPORT)
    }]);
  }

  private renderOrgDashboard = () => {
    this.renderDashboard(
      `select datemonth, avg(value)
            where subjecttype = 'org' and parentMetricId = ''
            group by datemonth
            order by datemonth limit 2500`,
      this.createNewYearSlider("yearSlider1"),
      'orgFavorability', 'orgDashboard', 'datatable1',
      () => {
        return [{
          calc: (datatable, rowIndex) => {
            let dt = datatable.getValue(rowIndex, 0);
            return [this.monthNames[dt.getMonth()], (dt.getYear() + 1900)].join('-');
          },
          type: 'string',
        },
          1];
      },
      Object.assign(this.standardOptions, {
        title:'Overall Favorability',
        legend:'none',
      })
    );
  }

  /**
   */
  private renderDrilldownMetricsByRoleDashboard  = (...filtervalues: string[]) => {
    this.renderDashboard(
      `select datemonth, subjectvalue, avg(value)
            where subjecttype = 'role' and parentMetricId <> ''
            group by datemonth, subjectvalue
            pivot metricId
            order by datemonth limit 2500`,
      this.createRoleCategoryFilter("roleCategoryFilter1", filtervalues),
      'metricsByRole', 'metricsByRoleDashboard', 'metricsByRoleDatatable',
      (datatable)=> {
        let numColumns = datatable.getNumberOfColumns();
        let columns = [];
        if (numColumns < 3) {
          alert('No metrics found');
          return columns;
        }
        let nextIndex = 0;
        columns[nextIndex++] = {
          calc: (datatable, rowIndex)=>{
            let dt = datatable.getValue(rowIndex, 0);
            return [this.monthNames[dt.getMonth()], (dt.getYear() + 1900)].join('-');
          },
          type: 'string',
        };
        for(let i = 2; i < numColumns; i++) {
          columns[nextIndex++] = i;
        }
        return columns;
      },
      Object.assign(this.standardOptions, {
        title:'Metrics by Role',
        legend: {position: 'right', textStyle: {color: 'purple', fontSize: '1em'}}
      })
    );
  }
  /**
   */
  private renderDrilldownMetricsByStaffDashboard  = (...filtervalues: string[]) => {
    this.renderDashboard(
      `select datemonth, subjectvalue, avg(value)
            where subjecttype = 'staff' and parentMetricId <> ''
            group by datemonth, subjectvalue
            pivot metricId
            order by datemonth limit 2500`,
      this.createRoleCategoryFilter("staffCategoryFilter1", filtervalues),
      'metricsByStaff', 'metricsByStaffDashboard', null,
      (datatable)=> {
        let numColumns = datatable.getNumberOfColumns();
        let columns = [];
        if (numColumns < 3) {
          alert('No metrics found');
          return columns;
        }
        let nextIndex = 0;
        columns[nextIndex++] = {
          calc: (datatable, rowIndex)=>{
            let dt = datatable.getValue(rowIndex, 0);
            return [this.monthNames[dt.getMonth()], (dt.getYear() + 1900)].join('-');
          },
          type: 'string',
        };
        for(let i = 2; i < numColumns; i++) {
          columns[nextIndex++] = i;
        }
        return columns;
      },
      Object.assign(this.standardOptions, {
        title:'Metrics by Staff',
        legend: {position: 'right', textStyle: {color: 'purple', fontSize: '1em'}}
      })
    );
  }

  private renderRoleDashboard = (...roles: string[]) => {
    this.renderDashboard(
      `select datemonth, avg(value)
            where subjecttype = 'role' and parentMetricId = ''
            group by datemonth
            pivot subjectvalue
            order by datemonth limit 2500`,
      this.createNewYearSlider("yearSlider3"),
      'roleFavorability', 'roleDashboard', 'datatable3',
      (datatable)=> {
        let numColumns = datatable.getNumberOfColumns();
        let columns = [];
        let nextIndex = 0;
        columns[nextIndex++] = {
          calc: (datatable, rowIndex)=>{
            let dt = datatable.getValue(rowIndex, 0);
            return [this.monthNames[dt.getMonth()], (dt.getYear() + 1900)].join('-');
          },
          type: 'string',
        };
        for(let i = nextIndex; i < numColumns; i++) {
          if (!roles || roles.indexOf(datatable.getColumnLabel(i)) >= 0) {
            columns[nextIndex++] = i;
          }
        }
        return columns;
      },
      Object.assign(this.standardOptions, {
        title:'Role Favorability',
        legend: {position: 'right', textStyle: {color: 'purple', fontSize: '1em'}}
      })
    );
  }
  private renderStaffDashboard = (...staffnames: string[]) => {
    this.renderDashboard(
      `select datemonth, avg(value)
          where subjecttype = 'staff' and parentMetricId = ''
          group by datemonth
          pivot subjectvalue
          order by datemonth limit 2500`,
      this.createNewYearSlider("yearSlider2"),
      'staffFavorability', 'staffDashboard', 'datatable2',
      (datatable)=> {
        let numColumns = datatable.getNumberOfColumns();
        let columns = [];
        let nextIndex = 0;
        columns[nextIndex++] = {
          calc: (datatable, rowIndex)=>{
            let dt = datatable.getValue(rowIndex, 0);
            return [this.monthNames[dt.getMonth()], (dt.getYear() + 1900)].join('-');
          },
          type: 'string',
        };
        for(let i = nextIndex; i < numColumns; i++) {
          if (!staffnames || staffnames.indexOf(datatable.getColumnLabel(i)) >= 0) {
            columns[nextIndex++] = i;
          }
        }
        return columns;
      },
      Object.assign(this.standardOptions, {
        title:'Staff Favorability',
        legend: {position: 'right', textStyle: {color: 'purple', fontSize: '1em'}}
      })
    );
  }

  private renderDashboard = (queryStr, filters, chartDiv, dashboardDiv, dataTableDiv, columnsGenerator, chartOptions) => {
    this.svc.getData(queryStr, QueryUtils.CHART_DATA_REPORT).then((response) => {
      Utils.info(queryStr);
      if (response.isError()) {
        alert(response.getReasons().join('.\n'));
        return;
      }
      let table = response.getDataTable();
      if (dataTableDiv) {
        new google.visualization.Table(document.getElementById(dataTableDiv)).draw(table);
      }
      if (chartDiv) {
        let columns = columnsGenerator(table);
        if (columns.length < 2) { // too few columns to render.
          return;
        }
        let chart = new google.visualization.ChartWrapper({
          chartType:'ColumnChart',
          containerId: chartDiv,
          view: [
            {columns: columns},
          ],
          options: chartOptions
        });
        if (dashboardDiv) {
          let dashboard = new google.visualization.Dashboard(
            document.getElementById(dashboardDiv));
          dashboard.bind(filters, chart);
          dashboard.draw(table);
        } else {
          chart.draw();
        }
      }
    });
  };

  private renderInfluencers = (queryStr, dataTableDiv, chartOptions) => {
    this.svc.getData(queryStr, QueryUtils.INFLUENCERS_REPORT).then((response) => {
      Utils.info(queryStr);
      if (response.isError()) {
        alert(response.getReasons().join('.\n'));
        return;
      }
      let table = response.getDataTable();
      table.removeColumn(0);
      table.removeColumn(1);
      let options = {
        showRowNumber: true,
        sort: 'disable'
      }
      if (dataTableDiv) {
        if (!document.getElementById(dataTableDiv)) {
          alert("Missing div in markup:" + dataTableDiv)
        }
        new google.visualization.Table(document.getElementById(dataTableDiv)).draw(table, options);
      }
    });
  };

  private renderTopInflunencersOnFavorabilityDashboard(metricName: string, tableDiv, promoterOrDetractor: boolean ) {
    this.renderInfluencers(
      `select datemonth, influencerMetric, sum(rank)
          where metricName = '` + metricName + `' and promoterOrDetractor=` + promoterOrDetractor + `
          group by datemonth, influencerMetric
          order by sum(rank) ` + (promoterOrDetractor ? 'desc' : 'asc') + `
          limit 2500`,
      tableDiv,
      Object.assign(this.standardOptions, {
        title:'Top Influencers on Staff Favorability',
        legend: {position: 'right', textStyle: {color: 'purple', fontSize: '1em'}}
      })
    );
  }
}

export enum ChartType {
  bar, line
}

export interface ChartConfiguration {
  filters: any[];
  chartWrappers: any[];
  dataTable: ()=>any;
  view?: number[];
}
