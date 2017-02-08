/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Type} from "class-transformer";

export class DailyDataList {

  list: DailyData[] = [];
  subject: string;
  startTime: number;
  endTime: number;

  get id(): string {
    return ['subject', this.subject, 'startTime', this.startTime, 'endTime', this.endTime].join(':');
  }
}

export class DailyData {
  customerId: string;
  subject: string;
  year: number;
  month: number;
  day: number;
  metricId: string;
  parentMetricId: string;
  @Type(() => Aggregate)
  aggregate: Aggregate;
}

export class Aggregate {
  count: number = 0;
  sum: number;
}
