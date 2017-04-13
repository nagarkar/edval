/**
 * Created by chinmay on 2/24/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {ChartService, ChartDataResponse} from "./chart.service";
import {Utils} from "../../shared/stuff/utils";
import {Dialogs} from "ionic-native";
import {QueryUtils, Query} from "./query.utils";
import {StaffService} from "../../services/staff/delegator";
import {Staff} from "../../services/staff/schema";
import {AccountService} from "../../services/account/delegator";
import {Config} from "../../shared/config";
import {Metric} from "../../services/metric/schema";
import {MetricAndSubject} from "./metric.subject";
import {AlertController} from "ionic-angular";
import {AnyComponent} from "../any.component";
import {Filters} from "./filters";
import {Formatters} from "./formatters";

declare let google;

export class ChartGenerator {
  createChart: (table: any)=> any;

  static createFrom(createChartFn: (table: any)=> any) {
    let chartGenerator: ChartGenerator = new ChartGenerator();
    chartGenerator.createChart = createChartFn;
    return chartGenerator;
  }

  static createFromChartDefinition(chartDefinition: any) {
    let chartFn = (table: any) => {
      return chartDefinition;
    };
    return ChartGenerator.createFrom(chartFn);
  }
}

export abstract class BaseChartComponent extends AnyComponent {

  static INSUFFICIENT_DATA = "Insufficient Data";

  static SELECT_UP_TO_LIMIT_ROWS = 'select * limit 2500';

  insufficientDataMessage = QueryUtils.INSUFFICIENT_DATA_MESSAGE;

  reportRefreshPolicyMessage = QueryUtils.REPORT_REFRESH_POLICY_MESSAGE;

  constructor(protected alertCtrl: AlertController, protected svc: ChartService, protected staffsvc: StaffService, protected accountsvc: AccountService){
    super();
  }

  protected getMetricAndSubjectValues(): Promise<Array<MetricAndSubject>> {
    let subjectsAndMetricNames: Array<MetricAndSubject> = [];
    return this.svc.getData(QueryUtils.PROMOTER_QUERY, QueryUtils.PROMOTER_COUNTS_REPORT)
      .then((response: ChartDataResponse)=> {
        if (response.isError()) {
          let formattedErr = Utils.format("Failed to get response to query {0}, for reasons {1}", QueryUtils.PROMOTER_QUERY, response.getReasons().join("\n"));
          Utils.error(formattedErr);
          throw formattedErr;
        }
        let staffNames: string[] = this.staffsvc.listCached()
          .map((staff: Staff)=>{
            return staff.username;
          });
        let roles: string[] = this.accountsvc.getCached(Config.CUSTOMERID).getStandardRoles();
        let datatable = response.getDataTable();
        let numRows = datatable.getNumberOfRows();
        for(let idx = 0; idx < numRows; idx++){
          let metricName = datatable.getValue(idx, 0);
          let subjecttype = datatable.getValue(idx, 1);
          let subjectvalue = datatable.getValue(idx, 2);
          if (
            (subjecttype == Metric.ROLE_SUBJECT_TYPE && roles.indexOf(subjectvalue) >= 0)
            || (subjecttype == Metric.ORG_SUBJECT_TYPE)
            || (subjecttype == Metric.STAFF_SUBJECT_TYPE && staffNames.indexOf(subjectvalue) >= 0)
          ) {
            subjectsAndMetricNames.push(new MetricAndSubject(metricName, subjecttype, subjectvalue));
          }
        }
        return subjectsAndMetricNames.sort((a: MetricAndSubject, b: MetricAndSubject): number =>  {
          return MetricAndSubject.compare(a, b);
        })
      })
      .catch((err)=>{
        Utils.error(err);
        throw err;
      })
  }


  /**
   * @param chartType Pick a chart type from https://developers.google.com/chart/interactive/docs/gallery
   * @param chartDiv Where to drop the chart
   * @param columnsGenerator A generator for the columns
   * @param chartOptions Chart options
   * @param arbitraryChartOptionsGenerator
   * @returns {any}
   */
  protected createDefaultChartGenerator(
    chartType: string,
    chartDiv: HTMLDivElement,
    columnsGenerator: ((table) => Array<any>),
    chartOptionsGenerator: (table)=> any): ChartGenerator {

    let chartFn = (table: any): any => {
      let columns = columnsGenerator(table);
      if (columns.length < 2) { // too few columns to render.
        return;
      }
      let arbitraryChartOptions = chartOptionsGenerator(table) || {};
      return new google.visualization.ChartWrapper({
        chartType: chartType ? chartType : 'ColumnChart',
        containerId: chartDiv,
        view: [
          {columns: columns},
        ],
        options: arbitraryChartOptions,
        dataTable: table
      });
    }

    return ChartGenerator.createFrom(chartFn);
  }

  /**
   * @param queryStr
   * @param reportType Pick a report type from ChartService
   * @param chartGen Chart Generator that creates a 'ChartWrapper'. This should come configured with it's container Div.
   * @param filters: A single filter or an array of filters. This should come configured with it's container Div.
   * @param dashboardDiv Where to drop the dashboard
   * @param errorDiv Where to drop the error.
   */
  protected renderDashboard(
    query: Query,
    chartGen: ChartGenerator,
    filters: any,
    dashboardDiv: HTMLDivElement,
    errorDiv: HTMLDivElement) {

    let queryStr = query.queryStr;
    let reportType = query.reportType;

    Utils.throwIfNNOU(chartGen);
    Utils.throwIfNNOU(errorDiv);

    Utils.showSpinner();
    this.svc.getData(queryStr, reportType)
      .then((response) => {
        Utils.hideSpinner();
        if (response.isError()) {
          this.writeToDivAndThrow(errorDiv, response.getReasons().join("\n"));
        }

        let table = response.getDataTable();
        if (table.getNumberOfRows() == 0) {
          this.writeToDivAndThrow(errorDiv, QueryUtils.INSUFFICIENT_DATA_MESSAGE);
        }

        let chart = chartGen.createChart(table);
        if (chart === BaseChartComponent.INSUFFICIENT_DATA) {
          this.writeToDivAndThrow(errorDiv, QueryUtils.INSUFFICIENT_DATA_MESSAGE);
        }
        if (dashboardDiv && filters) {
          errorDiv.innerHTML = "";
          let dashboard = new google.visualization.Dashboard(dashboardDiv);
          dashboard.bind(filters, chart);
          dashboard.draw(table);
        } else {
          chart.draw();
        }
      })
      .catch((err)=>{
        Utils.hideSpinner();
        Utils.error("In RenderDashboard, query: {0}, for reporttype {1}, with error: {2}", queryStr, reportType, err);
        throw err;
      });
  };

  renderTimeVsRatingDashboard(chartDivNativeEl, dashboardNativeEl, filterNativeEl, errorNativeEl, query: Query, title: string, legend?: string) {
    let columnsGenerator = Filters.getColumnGeneratorWithDateAsFirstMonthAndRemainingColumns();

    let chartOptionsGenerator = Formatters.getChartOptionsGeneratorFromDefaults({
      title: title,
      hAxis: { format:'MMM, y' },
      vAxis: {title: 'Rating (1 to 5)', format: '#', ticks:[1, 2, 3, 4, 5]},
      trendlines: {
        0: { type: 'linear', color: 'green', lineWidth: 3, opacity: 0.3, showR2: true, visibleInLegend: true}
      },
      legend: legend || 'none'
    });

    let monthYearFilter = Filters.createMonthYearFilter(filterNativeEl, 0 /* columnIndex */);

    let chartGen = this.createDefaultChartGenerator(
      'ColumnChart',
      chartDivNativeEl,
      columnsGenerator,
      chartOptionsGenerator
    );

    this.renderDashboard(
      query,
      chartGen,
      monthYearFilter,
      dashboardNativeEl, errorNativeEl);
  }
  /**
   *
   * @param reportType Pick a report type from ChartService
   * @param dataTableDiv Where to drop the dataTable
   * @param options
   * @param query Optional QUery. If not specified, the QueryUtils.SELECT_ALL query is used.
   * @returns {Promise<R>|Promise<T>|webdriver.promise.Promise<R>|Observable<R>|Promise<TResult|T>|Promise<U>|*}
   */
  protected renderTable(
    query: Query,
    dataTableDiv: HTMLDivElement,
    options?: any): Promise<ChartDataResponse> {

    Utils.showSpinner();
    let queryStr = query.queryStr;
    let reportType = query.reportType;
    return this.svc.getData(queryStr, reportType)
      .then((response: ChartDataResponse)=> {
        Utils.hideSpinner();
        if (response.isError()) {
          this.writeToDivAndThrow(dataTableDiv, response.getReasons().join("\n"));
        }
        if (response.getDataTable().getNumberOfRows() == 0) {
          this.writeToDivAndThrow(dataTableDiv, QueryUtils.INSUFFICIENT_DATA_MESSAGE);
        }
        let chart = new google.visualization.ChartWrapper({
          'chartType': 'Table',
          dataTable: response.getDataTable(),
          'options': options || {'title': 'All Data', 'legend': 'none'}
        });
        google.visualization.events.addListener(chart, 'ready', ()=> {
          Utils.hideSpinner();
        });
        google.visualization.events.addListener(chart, 'error', (error)=> {
          Utils.hideSpinner();
          let formattedErr = Utils.format("In renderTable, query: {0}, for reporttype {1}, with error: {2}", queryStr, reportType, [error.id, error.message].join(":"));
          Utils.error(formattedErr);
          this.writeToDivAndThrow(dataTableDiv, QueryUtils.INSUFFICIENT_DATA_MESSAGE);
        });
        chart.draw(dataTableDiv);
      })
      .catch((err)=>{
        Utils.hideSpinner();
        Utils.error("In renderTable, query: {0}, for reporttype {1}, with error: {2}", queryStr, reportType, err);
        throw err;
      });
  }

  protected emailPromoterCountsReportDetails(): Promise<any> {
    return this.emailQuery(QueryUtils.PROMOTER_DETRACTOR_RAW_QUERY());
  }

  protected emailCampaignMetricsDetails(): Promise<any> {
    return this.emailQuery(QueryUtils.CAMPAIGN_METRICS_RAW_QUERY());
  }

  protected emailChartDataReportDetails(): Promise<any> {
    return this.emailQuery(QueryUtils.METRIC_RATING_RAW_QUERY());
  }

  protected emailInfluencersReportDetails(): Promise<any> {
    return this.emailQuery(QueryUtils.INFLUENCER_METRIC_RAW_QUERY());
  }

  protected emailDetails(query: Query, fileName: string): Promise<any> {
    return this.emailQuery(query, fileName);
  }

  protected renderInfluencers(
    query: Query,
    dataTableDiv: HTMLDivElement,
    chartOptions) {

    Utils.throwIfNNOU(dataTableDiv);

    Utils.showSpinner();
    let queryStr =  query.queryStr;
    let reportType = query.reportType;
    return this.svc.getData(queryStr, reportType)
      .then((response: ChartDataResponse) => {
        Utils.hideSpinner();
        if (response.isError()){
          Utils.error("In RenderInfluencers, query: {0}, for reporttype {1}, with error: {2}", queryStr, reportType, response.getReasons().join("\n"));
          this.writeToDivAndThrow(dataTableDiv, QueryUtils.INSUFFICIENT_DATA_MESSAGE);
        }
        let table = response.getDataTable();
        if (table.getNumberOfRows() == 0) {
          this.writeToDivAndThrow(dataTableDiv, QueryUtils.INSUFFICIENT_DATA_MESSAGE);
        }
        if (table.getNumberOfColumns() > 1) {
          let numRows = table.getNumberOfColumns();
          for (let idx = 1; idx < numRows; idx++) {
            table.removeColumn(1); // Each time you remove a column indexes are adjusted, so can't use idx.
          }
        } else {
          this.writeToDivAndThrow(dataTableDiv, QueryUtils.INSUFFICIENT_DATA_MESSAGE);
        }

        let options = {
          showRowNumber: true,
          sort: 'disable',
          cssClassNames: {
            headerRow: 'googlechart-header-row',
            tableRow: 'googlechart-table-row',
            oddTableRow: 'googlechart-odd-table-row',
            selectedTableRow: 'googlechart-selected-table-row',
            hoverTableRow: 'googlechart-hover-table-row',
            headerCell: 'googlechart-header-cell',
            tableCell: 'googlechart-table-cell',
            rowNumberCell: 'googlechart-row-number-cell'
          }
        }
        new google.visualization.Table(dataTableDiv).draw(table, options);
      })
      .catch((err)=>{
        Utils.hideSpinner();
        Utils.error("In RenderInfluencers, query: {0}, for reporttype {1}, with error: {2}", queryStr, reportType, err);
        throw err;
      });
  };

  private emailQuery(query: Query, fileName?: string): Promise<any> {
    return this.emailData(query.queryStr, query.reportType, fileName ? fileName : query.reportType + '.csv');
  }

  private emailData(query: string, reportName: string, fileName: string): Promise<any> {
    Utils.showSpinner();
    return this.svc.postReportEmail(query, reportName, fileName)
      .catch((err)=>{
        Utils.hideSpinner();
        Dialogs.alert('Error while emailing report:' + err);
        throw err;
      })
      .then((result:any)=>{
        Utils.hideSpinner();
        Dialogs.alert('Email sent! Give it a few minutes and then check the email address associated with your login username');
        return result;
      })

  }

  private writeToDivAndThrow(errorDiv: HTMLDivElement, errMsg: string) {
    errorDiv.innerHTML = ["<span style='font-size:.85em'>", errMsg, "</h6>"].join("");
    throw errMsg;
  }
}
