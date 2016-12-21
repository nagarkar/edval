import {Injectable} from '@angular/core';

import {Metric} from './schema';
import {DelegatingService} from "../../shared/service/delegating.service";
import { MockMetricService} from "./mock";
import {LiveMetricService} from "./live";
import {Utils} from "../../shared/stuff/utils";

@Injectable()
export class MetricService extends DelegatingService<Metric> {

  private rootDrilldownMap: Map<string, Metric[]> = new Map<string, Metric[]>();

  constructor(
    mockService: MockMetricService,
    liveService: LiveMetricService) {

    super(mockService, liveService);
    this.onCreate.subscribe((next: Metric) => this.createCached(next));
    this.onDelete.subscribe((next: Metric) => this.deleteCached(next));
  }

  public reset() {
    super.reset();
    this.resetRootDrilldownMap();
  }

  public getCachedDrilldownMetrics(rootMetricId: string): Metric[] {
    let result: Metric[] = [];
    let metrics: Metric[] = this.listCached();
    let rootMetrics: string[] = this.getCachedMatchingRootMetrics(rootMetricId);
    rootMetrics.forEach((rootMetric: string)=>{
      result.push(...this.getCachedDrilldownMetricsFor(rootMetric));
    });
    return result;
  }

  private resetRootDrilldownMap() {
    this.rootDrilldownMap.clear();
    let allMetrics: Metric[] = this.listCached();
    let rootMetrics:Array<Metric> = this.getRootMetrics(allMetrics);

    let getDrilldownMetricsForRoot = function(metrics: Metric[], rootMetricId: string): Metric[] {
      return Array<Metric>(...metrics.filter((metric: Metric) => {return metric.parentMetricId === rootMetricId}));
    }

    rootMetrics.forEach((rootMetric: Metric) => {
      this.rootDrilldownMap.set(rootMetric.metricId, getDrilldownMetricsForRoot(allMetrics, rootMetric.metricId));
    })
  }


  private createCached(metric:Metric) {
    if (this.rootDrilldownMap.has(metric.metricId)) {
      return; // not really being created; not sure why this would every happen.
    }
    if (!metric.parentMetricId) {
      this.rootDrilldownMap.set(metric.metricId, []);
      return;
    }
    let drilldowns: Metric[] = this.rootDrilldownMap.get(metric.parentMetricId);
    drilldowns.push(metric);
    this.rootDrilldownMap.set(metric.parentMetricId, drilldowns);
  }

  private deleteCached(metric: Metric) {
    let map = this.rootDrilldownMap;
    if (map.has(metric.metricId) && map.get(metric.metricId) && map.get(metric.metricId).length > 0) {
      Utils.throw("Invalid state; trying to delete metric when it has drilldown children. Delete drilldowns first");
    }
    let drilldowns = map.get(metric.parentMetricId);
    let matchingMetric: number = null;
    drilldowns.forEach((dMetric: Metric, index : number)=>{
      if (dMetric.metricId == metric.metricId) {
        matchingMetric = index;
      }
    });
    drilldowns.splice(matchingMetric, 1);
    map.set(metric.parentMetricId, drilldowns);
  }

  private getRootMetrics(metrics: Metric[]) : Array<Metric> {
    return Array<Metric>(...metrics.filter((metric: Metric) => {return !metric.parentMetricId}));
  }

  private getCachedDrilldownMetricsFor(rootMetric: string): Metric[] {
    return this.rootDrilldownMap.get(rootMetric);
  }

  private getCachedMatchingRootMetrics(rootMetricId: string): string[] {
    let result: string[] = [];
    if (rootMetricId){
      result.push(this.getCached(rootMetricId).metricId);
      return result;
    }
    this.rootDrilldownMap.forEach((value:Metric[], rootMetric:string)=> result.push(rootMetric));
    return result;
  }

}
