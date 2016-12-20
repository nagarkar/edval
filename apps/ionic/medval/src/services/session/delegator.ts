import {Injectable} from '@angular/core';

import {Session} from './schema';
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockSessionService} from "./mock";
import {LiveSessionService} from "./live";
import {ErrorType} from "../../shared/stuff/error.types";
import {MetricValue} from "../metric/schema";
import {Utils} from "../../shared/stuff/utils";
import {SurveyNavigator} from "../survey/survey.navigator";
import {SurveyService} from "../survey/delegator";
import {MetricService} from "../metric/delegator";

@Injectable()
export class SessionService extends DelegatingService<Session> {

  surveyNavigator: SurveyNavigator;

  constructor(
    mockService: MockSessionService,
    liveService: LiveSessionService,
    private surveyService: SurveyService,
    private metricSvc: MetricService) {

    super(mockService, liveService);
  }

  getCurrentSession(): Session {
    return this.surveyNavigator.session;
  }

  newCurrentSession(surveyId: string): Session {
    let session: Session = new Session();
    session.properties.surveyId = surveyId;
    this.surveyNavigator = new SurveyNavigator(session, this.surveyService.getCached(surveyId), this.metricSvc);
    super.create(this.getCurrentSession());
    return this.getCurrentSession();
  }

  closeCurrentSession() {
    this.getCurrentSession().close();
    super.update(this.getCurrentSession());
    Utils.log("Setting session to null. Session: {0}", this.getCurrentSession());
    this.surveyNavigator = null;
  }

  recordNavigatedLocationInCurrentSession(location: string) {
    if (this.surveyNavigator) {
      this.getCurrentSession().addNavigatedLocation(location);
    } else {
      Utils.log("Attempted to call recordNavigatedLocationInCurrentSession with null currentSession");
    }
  }

  addToCurrentSession(subject: string, metricValue: MetricValue) {
    this.getCurrentSession().addMetricValue(subject, metricValue);
  }

  get(id: string, dontuseCache?: boolean) : Promise<Session> {
    return Promise.reject(ErrorType.UnsupportedOperation("get"));
  }

  list(dontuseCache?: boolean): Promise<Session[]> {
    return Promise.reject(ErrorType.UnsupportedOperation("list"));
  }

  getCached(id: string) :  Session{
    throw ErrorType.UnsupportedOperation("getCached");
  }

  listCached(): Session[] {
   throw ErrorType.UnsupportedOperation("listCached");
  }

  create(TMember: Session): Promise<Session> {
    return Promise.reject(ErrorType.UnsupportedOperation("create"));
  }

  update(TMember: Session): Promise<Session> {
    return Promise.reject(ErrorType.UnsupportedOperation("update"));
  }

  delete(id: string): Promise<boolean> {
    return Promise.reject(ErrorType.UnsupportedOperation("delete"));
  }
}
