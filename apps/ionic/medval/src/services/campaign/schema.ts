import {Config} from "../../shared/config";
export class Campaign {
  customerId: string;
  id: string;
  properties: {
    startDate?: number;
    endDate?: number;
    name: string;                           // Short display name (< 20 chars)
    goals?: string[];                        // Description of goals.
    roles?: string[];                        // List of roles we are trying to target.
    staff?: string[];                        // List of staff we are trying to target
    metrics?: string[];                      // List of Metric Ids we expect to be impacted.
    timeToAffectChange?: MeasurementWindow;  // How long is it expected to affect change?
  }

  statistics: {
    summary: ReportingSummary,
    metrics: SummaryMetrics[]
  }

  constructor(id: string, name: string) {
    this.customerId = Config.CUSTOMERID;
    this.id = id;
    this.properties = {
      name: name
    };
    this.statistics = {
      summary: {},
      metrics: []
    }
  }
}

export enum MeasurementWindow {
  Quarter, Month, Week
}

export interface SummaryMetrics {
  metricSubject?: string;                               // metricId:subject
  currentWindowStats?: MetricStatistics;     // Stats in current period (MeasurementWindow)
  previousWindowStats?: MetricStatistics;    // Stats in period before to campaign start date, or before current MeasurementWindow
}

export interface TimeSeries {
  customerId: string;
  id: string;                           // metricId:subject:time
  data: MetricTimeSeries;
}


export interface MetricStatistics {
  mean: number;
  frequencies: {
    detractor : number,
    promoter: number,
  }
}

export interface MetricTimeSeries {
  metricId: string;
  subject: string;
  series: Array<DataPoint>;
}

export interface DataPoint {
  time: number[];       // Array of numbers representing a date.
  value: string;        //
}

export interface ReportingSummary {
  totalSessions?: number;
  dateOfFirstFeedback?: number[];
  dateOfLastFeedback?: number[];
  last30daysSessions?: number;
  prior30daysSessions?: number;
}
