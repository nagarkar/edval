import {Metric, MetricValue, TextType} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {Staff} from "../staff/schema";
import {MetricService} from "./delegator";


export class MetricIterator implements Iterator<Metric> {

  // Calculated on startup based on maxMetrics@constructor.
  private maxDrilldowns;

  // State Variables.
  // The last root metric returned by this iterator, and it'svalue.
  // A root metric has at least one child (drilldown) by definition.
  private lastRootValue: MetricValue;
  private lastRoot: Metric;

  // The last metric, and it's value.
  private lastValue: MetricValue;
  private lastMetric: Metric;

  // All iterators; computed anew for each survey, but may be cached in the future.
  private userRootIterator: Iterator<Metric>;
  private roleRootIterator: Iterator<Metric>;
  private orgRootIterator: Iterator<Metric>
  private drilldownIteratorLookup: Map<Metric, Iterator<Metric>>;

  constructor(
    private maxMetrics: number,
    private metricService : MetricService,
    private staffSet: Set<Staff>,
    private roles: Set<string>) {

    Utils.log("IN METRIC ITERATOR with staff: {0}, roles: {1}", Utils.stringify(staffSet), roles);
    this.maxDrilldowns = this.computeMaxDrilldowns();
    let metrics: Metric[] = this.metricService.listCached();
    this.expandAndSetupMetricIterators(metrics);
  }

  next(value?: MetricValue): IteratorResult<Metric> {

    Utils.log("In metricIterator.next, with lastRoot {0}, lastRootValue: {1}, lastMetric: {2}, lastValue: {3}",
      this.lastRoot, this.lastRootValue, this.lastMetric, this.lastValue);

    let result: IteratorResult<Metric>;

    if (!this.lastRoot) {
      return this.saveAndReturn(this.getNextIteratorResultOrDone(
        this.userRootIterator,
        this.roleRootIterator,
        this.orgRootIterator
      ))
    }
    if (this.lastRoot && this.lastRoot.isHigh(this.lastRootValue)) {
      return this.saveAndReturn(this.getNextIteratorResultOrDone(
        this.orgRootIterator
      ));
    }
    if (this.lastRoot /*&& this.lastRoot.isLow(this.lastRootValue) */) {
      return this.saveAndReturn(this.getNextIteratorResultOrDone(
        this.drilldownIteratorLookup.get(this.lastRoot),
        this.userRootIterator,
        this.roleRootIterator,
        this.orgRootIterator
      ));
    }
    return this.saveAndReturn(this.getNextIteratorResultOrDone(
      this.userRootIterator,
      this.roleRootIterator,
      this.orgRootIterator
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
    if (this.drilldownIteratorLookup.has(this.lastMetric)) {
      this.lastRoot = result.value;
    }
    return result;
  }

  private expandAndSetupMetricIterators(retrievedMetrics: Metric[]) : void {
    const metrics = this.expandMetrics(retrievedMetrics);
    this.userRootIterator = this.getRootQuestionForUsers(metrics);
    this.roleRootIterator = this.getRootQuestionsForRoles(metrics);
    this.orgRootIterator = this.getRootQuestionsForOrgs(metrics);
    this.drilldownIteratorLookup = this.getDrilldownIteratorLookup(metrics);
    // Assume a single freeform text question.
  }

  private getRootQuestionForUsers(metrics: Metric[]): Iterator<Metric> {
    return this.getRootIterators(metrics, "staff", this.extractUserNames());
  }

  private getRootQuestionsForRoles(metrics: Metric[]) {
    return this.getRootIterators(metrics, "role", Array.from(this.roles));
  }

  private getRootQuestionsForOrgs(metrics: Metric[]) {
    return this.getRootIterators(metrics, "org", ['control']);
  }

  private getDrilldownIteratorLookup(metrics: Metric[]): Map<Metric, Iterator<Metric>> {
    let iteratorLookup = new Map<Metric, Iterator<Metric>>();

    let roots = metrics.filter((metric: Metric) => {
      return !metric.parentMetricId;
    });
    roots.forEach((root: Metric) => {
      let drilldowns = metrics.filter((metric: Metric) => {
        return metric.parentMetricId == root.metricId
          // TODO: When we support a ROLE root metric with a customized drilldown for specific staff, need to chang
          // next line and other similar in this class.
          && metric.subject == root.subject;
      });
      drilldowns = this.selectDrilldownMetrics(drilldowns);
      if (drilldowns.length > 0) { // drilldown must be at least length 1.
        iteratorLookup.set(root, drilldowns.values());
      }
    });
    return iteratorLookup;
  }

  private getRootIterators(
    metrics: Metric[], subjectPrefix: string, subjectValues: string[]) : Iterator<Metric> {

    let allRootMetrics = Array<Metric>();
    allRootMetrics.concat(metrics.filter((metric: Metric) => {
      return metric.subject === subjectPrefix && !metric.parentMetricId
    }));

    if (!subjectValues) {
      return;
    }

    subjectValues.forEach((subjectValue: string) => {
      let rootMetrics: Metric[] = metrics.filter((metric: Metric) => {
        return metric.subject === (subjectPrefix + ":" + subjectValue) && !metric.parentMetricId
      });
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
    return Utils.shuffle(drilldowns)
      .slice(0, Math.min(drilldowns.length, this.maxDrilldowns));
  }

  private expandMetrics(metrics: Metric[]): Metric[] {
    let expandedMetrics: Metric[] = metrics;
    this.staffSet.forEach((staff: Staff) => {
      metrics.forEach((metric: Metric) => {
        if (metric.hasRoleSubject() && staff.role == metric.getRoleSubject()) {
          let expandedMetric: Metric = Object.assign(new Metric(), metric);
          expandedMetric.setStaffSubject(staff.username);
          expandedMetrics.push(expandedMetric);
        }
      });
    })
    return expandedMetrics;
  }

  private extractUserNames(): string[] {
    let usernames: string[] = [];
    this.staffSet.forEach((staff: Staff) => {
      usernames.push(staff.username);
    });
    return usernames;
  }

  private computeMaxDrilldowns() {
    let mustHaveMetricsCount: number = 0;
    const npsRootMetrics = this.staffSet.size + this.roles.size;
    mustHaveMetricsCount += npsRootMetrics + 1 /* Control Question */;
    return Math.ceil((this.maxMetrics - mustHaveMetricsCount)/npsRootMetrics);
  }

}
