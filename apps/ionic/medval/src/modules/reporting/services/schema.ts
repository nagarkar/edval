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
