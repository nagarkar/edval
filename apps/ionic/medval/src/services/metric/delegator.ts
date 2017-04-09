/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Metric} from "./schema";
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockMetricService} from "./mock";
import {LiveMetricService} from "./live";
import {Utils} from "../../shared/stuff/utils";
import {RegisterService} from "../service.factory";

@Injectable()
@RegisterService
export class MetricService extends DelegatingService<Metric> {

  private rootDrilldownMap: Map<string, Metric[]> = new Map<string, Metric[]>();

  constructor(
    mockService: MockMetricService,
    liveService: LiveMetricService) {

    super(mockService, liveService, Metric);
    this.onCreate.subscribe((next: Metric) => this.createCached(next));
    this.onDelete.subscribe((next: Metric) => this.deleteCached(next));
  }

  public reset(): Promise<any>  {
    let promise: Promise<any> = super.reset();
    this.resetRootDrilldownMap();
    return promise;
  }

  public getRootMetricIds(): string[] {
    return this.listCached()
      .filter((value: Metric) => {return value.isRoot()})
      .map<string>((value: Metric) => {return value.metricId});
  }

  public getRootMetricsForSubject(subject: string): Metric[] {
    return this.listCached()
      .filter((value: Metric) => {return value.isRoot() && value.subject == subject})
  }

  public getOnlyOrgMetric(): Metric {
    return this.getOnlyRootMetricForSubject(Metric.ORG_SUBJECT_TYPE);
  }

  public getOnlyRoleRootMetric(roleSubject: string): Metric {
    return this.getOnlyRootMetricForSubject(roleSubject);
  }

  public getOnlyRootMetricForSubject(subj: string) : Metric {
    let rootMetrics = this.getRootMetricsForSubject(subj);
    Utils.throwIf((rootMetrics.length != 1), 'Got more than one metric; expected 1');
    Utils.throwIf((!rootMetrics || rootMetrics.length == 0), 'Got zero metrics; expected 1');
    return rootMetrics[0];
  }

  public getCachedMatchingRootMetrics(rootMetricId?: string): string[] {
    let result: string[] = [];
    if (rootMetricId){
      result.push(this.getCached(rootMetricId).metricId);
      return result;
    }
    this.rootDrilldownMap.forEach((value:Metric[], rootMetric:string)=> result.push(rootMetric));
    return result;
  }

  public getCachedNpsDrilldownMetrics(rootMetricId: string): Metric[] {
    if (!rootMetricId) {
      return this.listCached().filter((value: Metric) => {
        return value.isNpsType() && value.parentMetricId != null
      });
    }
    return this.listCached()
      .filter((value: Metric) => {
        return value.isNpsType() && value.parentMetricId == rootMetricId
    });
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

  getMetricById(metricId: string) {
    return super.getCached(metricId);
  }

  getMetricByName(mName: string) {
    let metric: Metric;
    super.listCached().forEach((m: Metric)=>{
      if (m.properties && m.properties.metricName == mName) {
        metric = m;
      }
    })
    return metric;
  }
}
