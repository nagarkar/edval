import {Http} from "@angular/http";
import {Config} from "../../shared/config";
import {HttpClient} from "../../shared/stuff/http.client";
import {Injectable} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {QueryUtils} from "./query.utils";
/**
 * Created by chinmay on 2/17/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

declare var google;

export interface ChartDataResponse {
  isError: () => boolean;
  getDataTable?: ()=> any;
  getReasons?: () => string[];
}

@Injectable()
export class ChartService {

  // Add new report types to static constant and instance array.

  private supportedReports = [
    QueryUtils.CHART_DATA_REPORT,
    QueryUtils.INFLUENCERS_REPORT,
    QueryUtils.PROMOTER_COUNTS_REPORT,
    QueryUtils.CAMPAIGN_METRICS_REPORT
  ];

  get urlPrefix(): string {
    return [Config.baseUrl, 'api/customers', Config.CUSTOMERID].join("/");
  };

  cache: Map<string, any> = new Map<string, any>();


  private static QUERY_REQUEST_PARAMETER = 'tq';
  private static DATASOURCE_REQUEST_PARAMETER = 'tqx';
  private static OUTPUT_TYPE_PARAM_NAME = 'out';
  private static OUTPUT_TYPE_TSV_EXCEL = 'tsv-excel'
  private static REQUEST_OUTFILENAME_PARAM_NAME = 'outFileName';


  constructor(private http: Http) {
    setInterval(()=>{
      this.cache.clear();
    }, 60 * 1000);
  }

  /*
  private createReportUrls() : any {
    let reportUrls: any = {};
    this.supportedReports.forEach((reportName)=>{
      reportUrls[reportName] = [this.urlPrefix, reportName].join("/");
    })
    return reportUrls;
  }
  */
  getReportUrl(reportType: string) {
    return [this.urlPrefix, reportType].join("/");
  }

  postReportEmail(query: string, reportType: string, fileName: string): Promise<any> {
    let queryForPost = this.createQueryForPost(this.createDataQuery(query, reportType), fileName);
    return this.postEmail(queryForPost);
  }

  /**
   *
   * @param query
   * @param reportType
   * @param getClone Use this if you plan to modify the table returned as part of your processing
   * @returns {Promise<ChartDataResponse>}
   */
  getData(query: string, reportType: string, getClone?: boolean) {
    let key = this.key(query, reportType);
    let dataTable = this.cache.get(key);
    if (dataTable) {
      if (getClone) {
        dataTable = dataTable.clone();
      }
      return Promise.resolve(this.createResponseFromDataTable(dataTable));
    }
    return this.get(this.createDataQuery(query, reportType)).then((response: ChartDataResponse)=>{
      if (response && !response.isError()) {
        this.cache.set(key, response.getDataTable().clone())
      }
      return response;
    });
  }

  private key(query: string, reportType: string): string {
    return [Config.CUSTOMERID, query, reportType].join(':');
  }

  private postEmail(query: string): Promise<any> {
    return this.http.post(query, "", HttpClient.createRequestOptionsArgs()).toPromise()
      .then((response)=>{
        if (!response.ok) {
          let formattedErr = Utils.format('Email could not be sent: ' + response.status + ":" + response.statusText);
          throw formattedErr;
        }
        return response;
      })
      .catch((err)=>{
        Utils.error("Error When Posting Email: {0}", err);
        throw err;
      })
  }


  private get(fullHttpQuery: string) {
    return this.http.get(fullHttpQuery, HttpClient.createRequestOptionsArgs()).toPromise()
      .then((response)=>{
        if (!response.ok || !response.text()) {
          return this.createError(response.status + '', response.text());
        }
        try {
          let text: string = response.text().trim();
          let prefix: string = "google.visualization.Query.setResponse(";
          let suffix: string = ");";
          text = text.substr(text.indexOf(prefix) + prefix.length);
          text = text.substr(0, text.lastIndexOf(suffix));
          return this.createResponseFromText(text);
        } catch (err) {
          return this.createError(err.message, err.stack);
        }
      }).catch((err)=>{
        Utils.error("In ChartService.get, Error: {0}", err);
        throw err;
      });

  }

  private createResponseFromText = (text: string): ChartDataResponse => {
    let datatable = new google.visualization.DataTable(eval("(" + text + ")").table);
    return {
      isError: () => { return false; },
      getDataTable: ()=> { return datatable }
    }
  }

  private createResponseFromDataTable = (datatable: any): ChartDataResponse => {
    return {
      isError: () => { return false; },
      getDataTable: ()=> { return datatable }
    }
  }

  private createError = (...args: string[]): any => {
    return {
      isError: () => {return true},
      getReasons: () => {return args}
    };
  };

  private createQueryForPost(dataQuery: string, fileName: String): string {
    let pair = (param, value): string => {
      return [param, value].join(":");
    }
    let query = [dataQuery, '&', ChartService.DATASOURCE_REQUEST_PARAMETER, "=",
      pair(ChartService.OUTPUT_TYPE_PARAM_NAME, ChartService.OUTPUT_TYPE_TSV_EXCEL), ";",
      pair(ChartService.REQUEST_OUTFILENAME_PARAM_NAME, fileName), ";"]
      .join("");
    return query;
  }

  private createDataQuery(dataQuery: string, reportType: string): string {
    Utils.throwIf(Utils.nou(dataQuery) || Utils.nou(reportType), "Query or report type can't be null");
    return this.createQuery(dataQuery, this.getReportUrl(reportType));
  }

  private createQuery(dataQuery: string, url: string) {
    let query =  [url, '?', ChartService.QUERY_REQUEST_PARAMETER,'=', dataQuery].join("");
    return query;
  }
}
