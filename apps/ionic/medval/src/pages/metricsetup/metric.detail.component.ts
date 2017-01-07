import {Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy} from "@angular/core";
import {Metric, NPSType} from "../../services/metric/schema";
import {MetricBush} from "./metric.summary.component";
@Component({
  templateUrl: './metric.detail.component.html',
  selector: 'metric-detail',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MetricDetailComponent implements OnInit{

  onState: string = '';

  @Output()
  displayToggled : EventEmitter<string> = new EventEmitter<string>();

  private _metricBush: MetricBush;

  toggleVisibility() {
    this.metricBush.isShown = !this.metricBush.isShown;
    this.displayToggled.emit(this.metricBush.subject);
  }

  @Input()
  set metricBush(bush: MetricBush) {
    this._metricBush = bush;
  }

  get metricBush() {
    return this._metricBush;
  }

  ngOnInit() { }

  addRootMetric() {
    this.metricBush.rootMetric = new Metric(new NPSType(), null, this.metricBush.subject);
  }

  removeRootMetric() {
    this.metricBush.rootMetric = null;
    this.metricBush.drilldownMetrics = [];
  }

  addDrilldownMetric() {
    let metric = new Metric(new NPSType(), null, this.metricBush.subject);
    metric.parentMetricId = this.metricBush.rootMetric.metricId;
    this.metricBush.drilldownMetrics.push(metric);
  }

  deleteDrilldown(index: number) {
    this.metricBush.drilldownMetrics.splice(index /* Starting location for deletion */, 1 /* Count to delete */);
  }
}
