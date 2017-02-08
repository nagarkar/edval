/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Config} from "../../shared/config";
import {Type} from "class-transformer";

export class Campaign {
  customerId: string;
  campaignId: string;

  @Type(() => CampaignProperties)
  properties: CampaignProperties = new CampaignProperties();

  @Type(() => Statistics)
  statistics: Statistics = new Statistics();

  constructor() {
    this.customerId = Config.CUSTOMERID;
  }
}

export class CampaignProperties {
  startDate?: number;
  endDate?: number;
  name: string;                             // Short display name (< 20 chars)
  goals?: string[];                         // Description of goals.
  roles?: string[];                         // List of roles we are trying to target.
  staff?: string[];                         // List of staff we are trying to target
  metrics?: string[];                       // List of Metric Ids we expect to be impacted.
  timeToAffectChange?: MeasurementWindow;   // How long is it expected to affect change?
}

export class Statistics {
  @Type(() => ReportingSummary)
  summary: ReportingSummary = new ReportingSummary();
  @Type(() => SummaryMetrics)
  metrics: SummaryMetrics[] = [];
}

export enum MeasurementWindow {
  Quarter, Month, Week
}

export class SummaryMetrics {
  metricSubject?: string; // metricId:subject
  // Stats in current period (MeasurementWindow)
  @Type(() => MetricStatistics)
  currentWindowStats?: MetricStatistics = new MetricStatistics();
  // Stats in period before to campaign start date, or before current MeasurementWindow
  @Type(() => MetricStatistics)
  previousWindowStats?: MetricStatistics = new MetricStatistics();
}


export class MetricStatistics {
  mean: number = 0;
  @Type(() => Frequencies)
  frequencies: Frequencies = new Frequencies();
}

export class Frequencies {
  totalCount: number = 1;
  detractor : number = 0;
  promoter: number = 0;
}

export interface TimeSeries {
  customerId: string;
  id: string;                           // metricId:subject:time
  data: MetricTimeSeries;
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

export class ReportingSummary {
  totalSessions?: number;
  dateOfFirstFeedback?: number;
  dateOfLastFeedback?: number;
  lastWindowSessionCount?: number;
  priorWindowSessionCount?: number;
}
