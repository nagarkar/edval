import {MetricService} from "./metric.service";
import {Metric, MetricValue, TextType} from "./schema";
import {Utils} from "../../shared/stuff/utils";


export class MetricIterator implements Iterator<Metric> {

  private static readonly MAX_DRILLDOWNS = 2;
  private static readonly ROLES : string[] = new Array<string>("MD", "PA", "ADMIN");

  private prevValue: MetricValue;
  private prev: Metric;
  private inDrilldownMode: number = 0;

  private userRootIterator: Iterator<Metric>;
  private roleRootIterator: Iterator<Metric>;
  private controlIterator: Iterator<Metric>;
  private drilldownIteratorLookup: Map<Metric, Iterator<Metric>>;
  private freeFormTextIterator: Iterator<Metric>;

  constructor(
    private utils: Utils,
    private questionSvc : MetricService,
    private usernames: Array<string>) {
    utils.log("IN METRIC ITERATOR");
    this.processQuestions();
  }

  next(value?: MetricValue): IteratorResult<Metric> {

    this.utils.log("In metricIterator.next, with prev {0}, preValue: {1}", this.prev, this.prevValue);
    if (this.inDrilldownMode == Number.MAX_VALUE) {
      return this.doneResult();
    }

    let result: IteratorResult<Metric>;

    if (this.inDrilldownMode == 0) {
      result = this.getNextRootMetric();

      if (!result.done) {
        this.inDrilldownMode++;
        return this.saveAsPrevious(result);
      } else {
        return this.saveAsPrevious(this.textMetric());
      }

    } else if (this.prev.isRoot() && this.prev.isInMiddle(this.prevValue)) {

      result = this.drilldownIteratorLookup.get(this.prev).next();
      if (!result.done) {
        return this.saveAsPrevious(result);
      }
      this.inDrilldownMode = 0;
      return this.next();

    } else if (this.prev.isRoot() && this.prev.isLow(this.prevValue)) {

      return this.textMetric();

    } else if (this.prev.isRoot() && this.prev.isHigh(this.prevValue)) {

      return this.textMetric();
    }
    this.inDrilldownMode = 0;
    return this.next();
  }

  updateAnswer(value: MetricValue) {
    this.prevValue = value;
  }

  private processQuestions() : void {
    let metrics: Metric[] = this.questionSvc.getQuestions();

    this.userRootIterator = this.getRootQuestionForUsers(metrics);
    this.roleRootIterator = this.getRootQuestionsForRoles(metrics);
    this.controlIterator = this.getControlIterator(metrics);
    this.drilldownIteratorLookup = this.getDrilldownIteratorLookup(metrics);
    // Assume a single freeform text question.
    this.freeFormTextIterator = metrics.filter((value: Metric) => {
      return value.properties.definition.textType;
    }).values();
  }

  private getRootQuestionForUsers(metrics: Metric[]): Iterator<Metric> {
    return this.getRootIterators(metrics, "staff", this.usernames);
  }

  private getRootQuestionsForRoles(metrics: Metric[]) {
    return this.getRootIterators(metrics, "role", MetricIterator.ROLES);
  }

  private getDrilldownIteratorLookup(metrics: Metric[]): Map<Metric, Iterator<Metric>> {
    let iteratorLookup = new Map<Metric, Iterator<Metric>>();

    let roots = metrics.filter((metric: Metric) => {
      return !metric.parentMetricId
    });
    roots.forEach((root: Metric) => {
      let drilldowns = metrics.filter((metric: Metric) => {
        return metric.parentMetricId == root.metricId;
      });
      drilldowns = this.selectDrilldownMetrics(drilldowns);
      iteratorLookup.set(root, drilldowns.values());
    });
    return iteratorLookup;
  }

  private getRootIterators(metrics: Metric[], subjectPrefix: string, subjectValues: string[]): Iterator<Metric> {
    let allRootMetrics = Array<Metric>();
    subjectValues.forEach((subjectValue: string) => {
      let rootMetrics: Metric[] = metrics.filter((metric: Metric) => {
        return metric.subject === (subjectPrefix + ":" + subjectValue)
          && !metric.parentMetricId;
      });
      /*
      if (rootMetrics.length == 0) {
        this.utils.presentTopToast(this.utils.format("Did not find any nps metrics for subject: {0}, value: {1}"
          + subjectPrefix, subjectValue));
      }
      if (rootMetrics.length > 1) {
        this.utils.presentTopToast(this.utils.format("Found more than one nps metrics for subject: {0}, value: {1}"
          + subjectPrefix, subjectValue));
      }
      */
      allRootMetrics = allRootMetrics.concat(rootMetrics);
    })
    return allRootMetrics.values();
  }

  private getControlIterator(metrics: Metric[]): Iterator<Metric> {
    return metrics.filter((metric: Metric) => {
      return metric.subject === "control";
    }).values();
  }

  private getNextRootMetric() : IteratorResult<Metric> {
    let result = this.userRootIterator.next();
    if (!result.done) {
      return result;
    }
    result = this.roleRootIterator.next();
    if (!result.done) {
      return result;
    }
    result = this.controlIterator.next();
    if (!result.done) {
      return result;
    }
  }

  private saveAsPrevious(result: IteratorResult<Metric>): IteratorResult<Metric> {
    this.prev = result.value;
    return result;
  }

  private doneResult(): IteratorResult<Metric> {
    this.inDrilldownMode = Number.MAX_VALUE;
    return {
      done : true,
      value: null,
    }
  }


  private selectDrilldownMetrics(drilldowns: Metric[]) {
    return this.utils.shuffle(drilldowns)
      .slice(0, Math.min(drilldowns.length, MetricIterator.MAX_DRILLDOWNS));
  }

  private textMetric() {
    this.inDrilldownMode = Number.MAX_VALUE;
    return this.freeFormTextIterator.next();
  }
}
