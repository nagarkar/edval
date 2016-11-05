import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import {Metric, MetricValue, NPSType, TextType} from "../../../services/metric/schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/rating/rating.component";
import {Staff} from "../../../services/staff/schema";
import {StaffService} from "../../../services/staff/delegator";

@Component({
  selector: 'survey-metric',
  templateUrl: 'metric.component.html',
  animations: [
    trigger('metricName', [
      transition('* => *', [
        style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }),
        animate('1s ease-in')
      ]),
    ])
  ]
})

export class MetricComponent {

  private _currentMetric: Metric; // Input()
  private _currentStaff: Staff;

  @Output() onAnswerSelection: EventEmitter<MetricValue> = new EventEmitter<MetricValue>();

  @ViewChild(RatingComponent) inputComponent: RatingComponent;

  constructor(
    private utils: Utils,
    private staffSvc: StaffService
  ) { }

  public onSelection(data) {
    this.onAnswerSelection.emit(new MetricValue(
      this._currentMetric.metricId, this._currentMetric.parentMetricId, data));
  }

  @Input()
  set currentMetric(metric: Metric) {

    if (this.inputComponent) {
      this.inputComponent.ratingValue = 0;
    }
    Utils.log("In metric component, got metric: " + Utils.stringify(metric));
    this._currentMetric = metric;
    this.tryAndExtractStaff();

  }

  get currentMetric() : Metric {
    return this._currentMetric;
  }

  get metricDisplayName(): string {
    let metric = this.currentMetric;
    if (!metric) {
      return;
    }
    const metricName = this.currentMetric.properties.metricName;
    if (this._currentStaff) {
      return Utils.format(metricName, this._currentStaff.displayName);
    } else {
      return metricName;
    }
    //return Utils.formatTemplate(this.currentMetric.properties.metricName, this._currentStaff);
  }

  private tryAndExtractStaff() {
    let metric = this.currentMetric;
    if (!metric) {
      return;
    }
    if(metric.hasStaffSubject()) {
      this.staffSvc.get(metric.getStaffSubject())
        .then((staff: Staff) => {
          this._currentStaff = staff;
        })
    }
  }
}
