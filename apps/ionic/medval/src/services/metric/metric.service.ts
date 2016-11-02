import { Injectable } from '@angular/core';

import { METRICS } from './mock';
import {Metric} from "./schema";

@Injectable()
export class MetricService {

  private static data : Metric[] = METRICS;
  constructor() { }

  getQuestions() : Metric[] {
    return MetricService.data;
  }

}
