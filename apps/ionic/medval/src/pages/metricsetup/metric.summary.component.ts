import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {Utils} from "../../shared/stuff/utils";
import {MetricService} from "../../services/metric/delegator";
import {AccountService} from "../../services/account/delegator";
import {Metric} from "../../services/metric/schema";
import {Account, Role} from "../../services/account/schema";
import {Config} from "../../shared/config";
@Component({
  templateUrl:'metric.summary.component.html',
  selector:'metric-setup'
})

export class MetricSummaryComponent implements OnInit{

  subjectMetricMap: Map<string, MetricBush> = new Map<string, MetricBush>();

  private allIds: Set<string> = new Set<string>();

  standardRoles: Role[] = [];

  constructor(
    private utils: Utils,
    private navCtrl: NavController,
    private metricSvc: MetricService,
    private accountSvc: AccountService) {

    this.accountSvc.get(Config.CUSTOMERID)
      .then((account: Account) =>{
        this.standardRoles = account.getStandardRoles();
        this.metricSvc.list()
          .then((metrics: Metric[]) => {
            this.processMetrics(metrics);
          });
      })
  }

  ngOnInit() {

  }

  updateDisplayState(subject: string) {
    let displayState = this.subjectMetricMap.get(subject).isShown;
    if (!displayState) {
      return;
    }
    this.subjectMetricMap.forEach((value: MetricBush)=>{
      if (value.subject != subject) {
        value.isShown = false;
      }
    })
  }

  cancel() {
    this.navCtrl.pop();
  }

  save() {
    try {
      let seenIds: Set<string> = new Set<string>();
      let toDelete: string[] = [];
      let toUpdate: Metric[] = [];
      let toCreate: Metric[] = [];
      this.subjectMetricMap.forEach((value: MetricBush) => {
        if (value.rootMetric) {
          this.chooseUpdateOrCreate(value.rootMetric, toUpdate, toCreate);
          seenIds.add(value.rootMetric.metricId);
        }
        value.drilldownMetrics.forEach((value: Metric) => {
          this.chooseUpdateOrCreate(value, toUpdate, toCreate);
          seenIds.add(value.metricId);
        });
      });
      this.allIds.forEach((allId: string)=>{
        if (!seenIds.has(allId)) {
          toDelete.push(allId);
        }
      })
      this.deleteAll(toDelete);
      this.createAll(toCreate);
      this.updateAll(toUpdate);

    } catch(error) {
      Utils.log("Error in ")
    } finally {
      this.navCtrl.pop();
    }
  }

  private processMetrics(metrics: Metric[]) {
    let subjects: Set<string> = new Set();
    metrics.forEach((metric:Metric)=>{
      subjects.add(metric.subject);
    });
    this.createSubjectMetricMap(subjects);
    this.assignMetricBushes(metrics);
    this.allIds = this.collectExistingIds();
  }

  private createSubjectMetricMap(subjects: Set<string>) {
    this.subjectMetricMap.set("org", new MetricBush("org"));
    this.standardRoles.forEach((role:Role)=>{
      let roleSubj: string = Metric.createRoleSubject(role.roleId);
      this.subjectMetricMap.set(roleSubj, new MetricBush(Metric.createRoleSubject(roleSubj)));
    });
    subjects.forEach((subject: string)=>{
      if (!this.subjectMetricMap.has(subject)) {
        this.subjectMetricMap.set(subject, new MetricBush(subject));
      }
    });
  }

  private assignMetricBushes(metrics: Metric[]) {
    metrics.forEach((metric: Metric)=>{
      let subject = metric.subject;
      let metricBush: MetricBush = this.subjectMetricMap.get(subject);
      if (metric.isRoot()) {
        metricBush.rootMetric = metric;
      } else {
        metricBush.drilldownMetrics.push(metric);
      }
    });
  }

  private collectExistingIds(): Set<string> {
    let allIds: Set<string> = new Set<string>();
    this.subjectMetricMap.forEach((value: MetricBush)=>{
      if (value.rootMetric) {
        allIds.add(value.rootMetric.metricId);
      }
      value.drilldownMetrics.forEach((metric: Metric)=>{
        allIds.add(metric.metricId);
      })
    });
    return allIds;
  }

  private chooseUpdateOrCreate(metric: Metric, toUpdate: Metric[], toCreate: Metric[]) {
    if (this.allIds.has(metric.metricId)) {
      toUpdate.push(metric);
    } else {
      toCreate.push(metric);
    }

  }

  private deleteAll(toDelete: string[]) {
    toDelete.forEach((id: string)=>{
      this.metricSvc.delete(id);
    })
  }

  private createAll(toCreate: Metric[]) {
    toCreate.forEach((metric: Metric)=>{
      this.metricSvc.create(metric);
    })
  }

  private updateAll(toUpdate: Metric[]) {
    toUpdate.forEach((metric: Metric)=>{
      this.metricSvc.update(metric);
    })
  }
}

export class MetricBush {

  subject: string;
  isShown: boolean = false;

  constructor(subj: string) {
    this.subject = subj;
  }

  rootMetric: Metric;

  drilldownMetrics: Metric[] = [];

  copy(): MetricBush {
    let copy: MetricBush = new MetricBush(this.subject);
    copy.drilldownMetrics = this.drilldownMetrics.map((metric: Metric) =>{
      return Object.assign<Metric, Metric>(new Metric(), metric);
    })
    if (this.rootMetric) {
      copy.rootMetric = Object.assign<Metric, Metric>(new Metric(), this.rootMetric);
    }
    return copy;
  }
}
