import {Component, Input, Output, EventEmitter, AfterViewInit, ViewChild} from '@angular/core';
import {Metric, MetricValue, NPSType, TextType} from "../metric.schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/rating/rating.component";

@Component({
  selector: 'survey-metric',
  templateUrl: 'metric.component.html',
})

export class MetricComponent implements AfterViewInit {

  private _currentMetric: Metric; // Input()
  isMetricNpsType: boolean; // set with _currentMetric
  metricValue: string;

  @Output() onAnswerSelection: EventEmitter<MetricValue> = new EventEmitter<MetricValue>();

  @ViewChild(RatingComponent) inputComponent: RatingComponent

  constructor(private utils: Utils) { }

  ngAfterViewInit(): void {
  }

  public onSelection(data) {
    this.onAnswerSelection.emit(new MetricValue(this._currentMetric.metricId, this.metricValue));
  }

  @Input()
  set currentMetric(metric: Metric) {
    if (this.inputComponent) {
      this.inputComponent.ratingValue = 0;
    }
    this.utils.log("In metric component, got metric: " + JSON.stringify(metric));
    this._currentMetric = metric;
    this.setMetricType();
  }

  get currentMetric() : Metric {
    return this._currentMetric;
  }

  /*
  isMetricNpsType(): boolean {
    let ret: boolean = this.currentMetric.properties.definition.type instanceof NPSType;
    this.logger.log("In metric nps type: " + ret);
    return ret;
  }
  */

  isMetricTextType(): boolean {
    return this._currentMetric.properties.definition.type instanceof TextType;
  }

  private setMetricType() {
    let type : TextType | NPSType = this.currentMetric.properties.definition.type;
    this.isMetricNpsType = !(type && type.hasOwnProperty("language"));
    this.utils.log("In metric component, metric type: " + this.isMetricNpsType);
  }
}
