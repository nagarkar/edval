import { Injectable } from '@angular/core';

import { METRICS } from './mock.metric.data';
import {Metric} from "./metric.schema";

@Injectable()
export class MetricService {

  private static data : Metric[] = METRICS;
  constructor() { }

  getQuestions() : Metric[] {
    return MetricService.data;
  }

}
