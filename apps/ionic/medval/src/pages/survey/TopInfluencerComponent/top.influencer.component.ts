import {Component} from "@angular/core";
import {NavController, NavParams, LoadingController} from "ionic-angular";
import {Config} from "../../../shared/config";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {MetricService} from "../../../services/metric/delegator";
import {Metric, MetricValue} from "../../../services/metric/schema";
import {Account} from "../../../services/account/schema";
import {AccountService} from "../../../services/account/delegator";
import {SurveyPage} from "../survey.page";
import {Idle} from "@ng-idle/core";
import {SReplacer} from "../../../pipes/sreplacer";

@Component({
  templateUrl: './top.influencer.component.html',
  providers: [Idle]
})

@RegisterComponent
export class TopInfluencerComponent extends SurveyPage {

  private rootMetricId: string;
  private maxMetrics: number;
  private valueOrderDesc: boolean;
  private numSelections: number;
  private offsetRange: number;
  private rankedMetrics: Metric[] = [];

  message: string;
  displayMetrics: Metric[] = [];
  rows: any[] = [];
  numCols = 0;
  leftImage: string;
  displayAttribute: string;
  account: Account;
  done = false;

  constructor(
    idle: Idle,
    navParams: NavParams,
    tokenProvider: AccessTokenService,
    sessionSvc: SessionService,
    utils: Utils,
    navCtrl: NavController,
    loadingCtrl: LoadingController,
    private accountSvc: AccountService,
    private metricSvc: MetricService,
    private sReplacer: SReplacer) {

    super(loadingCtrl, navCtrl, sessionSvc, idle);

    try {

      let def = Utils.value;
      this.account = accountSvc.getCached(Config.CUSTOMERID);

      this.rootMetricId = def(navParams.get('rootMetricId'), null);
      this.maxMetrics = def(+navParams.get('maxMetrics'), Infinity);
      this.numSelections = def(+navParams.get('numSelections'), 1);
      this.valueOrderDesc = def(navParams.get('valueOrderDesc'), false);
      this.message = def(navParams.get('title'), undefined);
      this.offsetRange = def(+navParams.get('offsetRange'), 0.5);
      this.numCols = def(navParams.get('numCols'), 2);

      if (this.numSelections === 0) {
        this.setDoneAfter(5 * 1000 /* 5 seconds */);
      }

      this.displayAttribute = this.valueOrderDesc ? 'positiveImpact' : 'improvement';

      this.leftImage = this.pickRandomImage();

      let metricIds: string[] = this.sessionSvc.scratchPad.metricsForTopLineInfluencer;

      if (metricIds && metricIds.length > 0) {
        this.displayMetrics = this.shuffleAndSlice(metricIds.map((metricId: string)=> {
          return this.metricSvc.getMetricById(metricId.trim());
        }).filter((value)=> {
          return value != null
        }));
      } else {
        this.displayMetrics = this.setupDisplayMetrics(metricSvc);
      }

      this.rows = Array.from(Array(Math.ceil(this.displayMetrics.length / this.numCols)).keys())
    } catch(err) {
      Utils.error(err);
      SurveyNavUtils.goToStart(this.navCtrl);
    }
  }

  registerRank(metric: Metric) {
    let currentIndex = this.rankedMetrics.indexOf(metric);
    if (currentIndex >= 0) {
      this.rankedMetrics.splice(currentIndex, 1);
      metric['isSelected'] = false;
      return;
    }
    this.rankedMetrics.push(metric);
    if (this.rankedMetrics.length == Math.min(this.numSelections, this.displayMetrics.length)) {
      this.persistMetricValuesAndNavigate();
    }
    metric['isSelected'] = true;
  }

  isSelected(metric: Metric) {
    return this.rankedMetrics.indexOf(metric) > -1;
  }

  private pickRandomImage() {
    if (this.valueOrderDesc) {
      return Utils.shuffle([
        'http://blog.insurancejobs.com/wp-content/uploads/2012/04/InterviewQuestionWhatAreYourWeaknesses.jpg',
        'http://www.medpreps.com/wp-content/uploads/2012/08/interview-strength.jpg',
      ])[0];
    } else {
      return Utils.shuffle([
        'http://blog.insurancejobs.com/wp-content/uploads/2012/04/InterviewQuestionWhatAreYourWeaknesses.jpg',
        'http://www.clipartkid.com/images/280/mistake-clipart-fault-error-mistake-and-flaws-OI2dFx-clipart.jpg',
        'data:image/png;base64,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',
      ])[0];
    }

  }

  /** Gets drilldown metrics for current root metric, shuffles result, and then picks top N items */
  private setupDisplayMetrics(metricSvc: MetricService) {
    let drilldownMetrics: Metric[] = metricSvc.getCachedNpsDrilldownMetrics(this.rootMetricId);
    drilldownMetrics = this.removeMeasuredMetrics(drilldownMetrics);
    return this.shuffleAndSlice(drilldownMetrics);
  }

  private shuffleAndSlice(drilldownMetrics: Metric[]): Metric[] {
    Utils.shuffle(drilldownMetrics);
    drilldownMetrics = drilldownMetrics.slice(0, Math.min(this.maxMetrics, drilldownMetrics.length));
    return drilldownMetrics.sort((a:Metric, b:Metric) => {
      return this.sReplacer.transform(b.properties[this.displayAttribute]).length -
        this.sReplacer.transform(a.properties[this.displayAttribute]).length;
    });
  }

  private removeMeasuredMetrics(drilldownMetrics: Metric[]): Metric[] {
    if (!this.sessionSvc.hasCurrentSession()) {
      Utils.error("TopInfluencerComponent.removeMeasuredMetrics(): No current session found")
      return;
    }
    let metricIds: Set<string> = this.sessionSvc.getCurrentSession().getAllMetricIdsAsSet();
    return drilldownMetrics.filter((metric: Metric) => {
      return !metricIds.has(metric.metricId);
    })
  }

  private persistMetricValuesAndNavigate() {
    let numRanked = this.rankedMetrics.length;
    let offset = this.offsetRange/numRanked;
    this.rankedMetrics.forEach((metric: Metric, index: number) => {
      let value: number = null;
      let range = metric.properties.definition.npsType.range;
      if (this.valueOrderDesc) {
        value = Math.floor(range * (1 - offset * (index + 1)));
      } else {
        value = Math.floor(range * offset * (index + 1));
      }
      this.sessionSvc.getCurrentSession().addMetricValue(metric.subject, new MetricValue(metric.metricId, '' + value));
    })
    this.setDoneAfter(1000);
  }

  private setDoneAfter(timeout: number) {
    setTimeout(()=>{
      this.done = true;
    }, timeout)

  }
}
