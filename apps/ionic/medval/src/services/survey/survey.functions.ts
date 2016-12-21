
import {ISurveyFunction, SurveyNavigator, RegisterFunction} from "./survey.navigator";
import {Survey} from "./schema";
import {Session} from "../session/schema";
import {Metric, MetricValue} from "../metric/schema";

@RegisterFunction
export class AllPromoters implements ISurveyFunction {

  canExecute(navigator: SurveyNavigator, params: any): boolean {
    return true;
  }

  execute(navigator: SurveyNavigator, params: any): string|number {
    let metricIds: string[] = navigator.metricSvc.getCachedMatchingRootMetrics();
    return navigator.session.getAllMetricValues().every((metricValue: MetricValue) => {
      let metric: Metric = navigator.metricSvc.getCached(metricValue.metricId);
      if (metric.parentMetricId || (metric.isNpsType() && metric.isPromoter(+metricValue.metricValue))) {
        return true;
      }
      return false;
    }).toString();
  }

}

@RegisterFunction
export class AnyDetractors implements ISurveyFunction {

  canExecute(navigator: SurveyNavigator, params: any): boolean {
    return true;
  }

  execute(navigator: SurveyNavigator, params: any): string|number {

    let metricIds: string[] = navigator.metricSvc.getCachedMatchingRootMetrics();
    return (!navigator.session.getAllMetricValues().every((metricValue: MetricValue) => {
      let metric: Metric = navigator.metricSvc.getCached(metricValue.metricId);
      if (metric.parentMetricId || (metric.isNpsType() && !metric.isDetractor(+metricValue.metricValue))) {
        return true;
      }
      return false;
    })).toString();
  }
}

@RegisterFunction
export class StrongPromoter implements ISurveyFunction {

  canExecute(navigator: SurveyNavigator, params: any): boolean {
    if (!params.metricId) {
      return false;
    }
    let metric: Metric = navigator.metricSvc.getCached(params.metricId);
    let metricValue: string = navigator.session.getMetricValue(metric.subject, metric.metricId);
    return metric !== null && metricValue !== null;
  }

  execute(navigator: SurveyNavigator, params: any): string|number {
    let metric: Metric = navigator.metricSvc.getCached(params.metricId);
    let metricValue: string = navigator.session.getMetricValue(metric.subject, metric.metricId);
    return (metric.isNpsType() && metric.isPromoter(+metricValue)).toString();
  }
}

@RegisterFunction
export class StrongDetractor implements ISurveyFunction {

  canExecute(navigator: SurveyNavigator, params: any): boolean {
    if (!params.metricId) {
      return false;
    }
    let metric: Metric = navigator.metricSvc.getCached(params.metricId);
    let metricValue: string = navigator.session.getMetricValue(metric.subject, metric.metricId);
    return metric !== null && metricValue !== null;
  }

  execute(navigator: SurveyNavigator, params: any): string|number {
    let metric: Metric = navigator.metricSvc.getCached(params.metricId);
    let metricValue: string = navigator.session.getMetricValue(metric.subject, metric.metricId);
    return (metric.isNpsType() && metric.isDetractor(+metricValue)).toString();
  }
}
