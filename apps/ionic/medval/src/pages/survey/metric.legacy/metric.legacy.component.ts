import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  trigger,
  style,
  transition,
  animate
} from '@angular/core';
import {Metric, MetricValue} from "../../../services/metric/schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/rating/rating.component";
import {Staff} from "../../../services/staff/schema";
import {StaffService} from "../../../services/staff/delegator";
import {ISurveyComponent} from "../../../services/survey/survey.navigator";

@Component({
  selector: 'survey-metric',
  templateUrl: 'metric.legacy.component.html',
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

export class MetricComponentLegacy implements ISurveyComponent {

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
      this._currentMetric.metricId, data));
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
      let ctx: Map<string, any> = new Map();
      ctx.set("staff", this._currentStaff);
      ctx.set("metric", this.currentMetric);
      return Utils.formatTemplate(metricName, ctx);
      //return Utils.format(metricName, this._currentStaff.displayName);
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
