import {MetricService} from "./metric.service";
import {Metric, MetricValue, TextType} from "./schema";
import {Utils} from "../../shared/stuff/utils";


export class MetricIterator implements Iterator<Metric> {

  private static readonly MAX_DRILLDOWNS = 4;
  private static readonly ROLES : string[] = new Array<string>("MD", "PA", "ADMIN");

  private lastRootValue: MetricValue;
  private lastRoot: Metric;
  private lastValue: MetricValue;
  private lastMetric: Metric;
  //private mode: number = 0;

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

    this.utils.log("In metricIterator.next, with lastRoot {0}, lastRootValue: {1}, lastMetric: {2}, lastValue: {3}",
      this.lastRoot, this.lastRootValue, this.lastMetric, this.lastValue);

    let result: IteratorResult<Metric>;

    if (!this.lastRoot) {
      return this.saveAndReturn(this.getNextIteratorResultOrDone(
        this.userRootIterator,
        this.roleRootIterator
      ))
    }
    if (this.lastRoot && this.lastRoot.isLow(this.lastRootValue)) {
      return this.saveAndReturn(this.getNextIteratorResultOrDone(
        this.drilldownIteratorLookup.get(this.lastRoot),
        this.userRootIterator,
        this.roleRootIterator,
        this.freeFormTextIterator,
        this.controlIterator
      ));
    }
    if (this.lastRoot && this.lastRoot.isHigh(this.lastRootValue)) {
      return this.saveAndReturn(this.getNextIteratorResultOrDone(
        this.freeFormTextIterator,
        this.controlIterator
      ));
    }
    return this.saveAndReturn(this.getNextIteratorResultOrDone(
      this.userRootIterator,
      this.roleRootIterator,
      this.freeFormTextIterator,
      this.controlIterator
    ));
  }

  updateAnswer(value: MetricValue) {
    this.lastValue = value;
    if (this.lastMetric == this.lastRoot) {
      this.lastRootValue = value;
    }
  }

  private saveAndReturn(result: IteratorResult<Metric>): IteratorResult<Metric> {
    if (result.done) {
      return result;
    }
    this.lastMetric = result.value;
    if (this.lastMetric.isRoot()) {
      this.lastRoot = result.value;
    }
    return result;
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
      return !metric.parentMetricId && metric.isNpsType();
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
          && !metric.parentMetricId
          && metric.isNpsType();
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

  private getNextIteratorResultOrDone(...iterators: Iterator<Metric>[]) : IteratorResult<Metric> {
    let result : IteratorResult<Metric>;
    for (let i = 0; i < iterators.length; i++){
      result = iterators[i].next();
      if (!result.done) {
        break;
      }
    }
    return result;
  }

  private selectDrilldownMetrics(drilldowns: Metric[]) {
    return this.utils.shuffle(drilldowns)
      .slice(0, Math.min(drilldowns.length, MetricIterator.MAX_DRILLDOWNS));
  }
}
