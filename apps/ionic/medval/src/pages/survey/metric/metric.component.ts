import {Component, Input, Output, EventEmitter, AfterViewInit, ViewChild} from '@angular/core';
import {Metric, MetricValue, NPSType, TextType} from "../../../services/metric/schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/rating/rating.component";

@Component({
  selector: 'survey-metric',
  templateUrl: 'metric.component.html',
})

export class MetricComponent {

  private _currentMetric: Metric; // Input()

  @Output() onAnswerSelection: EventEmitter<MetricValue> = new EventEmitter<MetricValue>();

  @ViewChild(RatingComponent) inputComponent: RatingComponent;

  constructor(private utils: Utils) { }

  public onSelection(data) {
    this.onAnswerSelection.emit(new MetricValue(
      this._currentMetric.metricId, this._currentMetric.parentMetricId, data));
  }

  @Input()
  set currentMetric(metric: Metric) {
    if (this.inputComponent) {
      this.inputComponent.ratingValue = 0;
    }
    this.utils.log("In metric component, got metric: " + JSON.stringify(metric));
    this._currentMetric = metric;
  }

  get currentMetric() : Metric {
    return this._currentMetric;
  }

}
