import {Injectable} from '@angular/core';

import {Metric} from './schema';
import {DelegatingService} from "../../shared/service/delegating.service";
import { MockMetricService} from "./mock";
import {LiveMetricService} from "./live";

@Injectable()
export class MetricService extends DelegatingService<Metric> {

  constructor(
    mockService: MockMetricService,
    liveService: LiveMetricService) {

    super(mockService, liveService);
  }
}
