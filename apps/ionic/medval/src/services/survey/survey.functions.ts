import {ISurveyFunction, SurveyNavigator, RegisterFunction} from "./survey.navigator";
import {Metric, MetricValue} from "../metric/schema";

@RegisterFunction
export class AllPromoters implements ISurveyFunction {

  canExecute(navigator: SurveyNavigator, params: any): boolean {
    return true;
  }

  execute(navigator: SurveyNavigator, params: any): string|number {
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
export class AveragePromoterScore implements ISurveyFunction {

  canExecute(navigator: SurveyNavigator, params: any): boolean {
    return true;
  }

  execute(navigator: SurveyNavigator, params: any): string|number {
    let total = 0;
    let numMetrics = 0;
    navigator.session.getAllMetricValues().forEach((metricValue: MetricValue) => {
      let metric: Metric = navigator.metricSvc.getCached(metricValue.metricId);
      if (!metric.parentMetricId && metric.isNpsType()) {
        numMetrics ++;
        total += (+metricValue.metricValue)/metric.properties.definition.npsType.range;
      }
    });
    return (numMetrics != 0 && Metric.isPromoterRatio(total/numMetrics)).toString();
  }
}

@RegisterFunction
export class AnyDetractors implements ISurveyFunction {

  canExecute(navigator: SurveyNavigator, params: any): boolean {
    return true;
  }

  execute(navigator: SurveyNavigator, params: any): string|number {

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
