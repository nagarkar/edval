
import {ISurveyFunction, SurveyNavigator, RegisterFunction} from "./survey.navigator";
import {Survey} from "./schema";
import {Session} from "../session/schema";
import {Metric} from "../metric/schema";

@RegisterFunction
export class AllNPSPromoters implements ISurveyFunction {

  constructor() {}

  canExecute(navigator: SurveyNavigator): boolean {
    return undefined;
  }

  execute(navigator: SurveyNavigator): string|number {
    return undefined;
  }
}
@RegisterFunction
export class AnyStrongDetractors implements ISurveyFunction {

  constructor() {}

  canExecute(navigator: SurveyNavigator): boolean {
    return undefined;
  }

  execute(navigator: SurveyNavigator): string|number {
    return undefined;
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
