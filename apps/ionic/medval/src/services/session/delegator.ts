import {Injectable} from "@angular/core";
import {Session} from "./schema";
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockSessionService} from "./mock";
import {ErrorType} from "../../shared/stuff/error.types";
import {Utils} from "../../shared/stuff/utils";
import {SurveyNavigator} from "../survey/survey.navigator";
import {SurveyService} from "../survey/delegator";
import {MetricService} from "../metric/delegator";
import {RegisterService} from "../service.factory";
import {LiveSessionService} from "./live";
import {DDBSessionService} from "./ddb";

@Injectable()
@RegisterService
export class SessionService extends DelegatingService<Session> {

  surveyNavigator: SurveyNavigator;

  constructor(
    mockService: MockSessionService,
    //liveService: LiveSessionService,
    liveService: DDBSessionService,
    private surveyService: SurveyService,
    private metricSvc: MetricService) {

    super(mockService, liveService, Session);
  }

  hasCurrentSession(): boolean {
    return this.surveyNavigator != null && this.surveyNavigator.session != null;
  }

  getCurrentSession(): Session {
    return this.surveyNavigator.session;
  }

  newCurrentSession(surveyId: string): Session {
    let session: Session = new Session();
    session.properties.surveyId = surveyId;
    this.surveyNavigator = new SurveyNavigator(session, this.surveyService.getCached(surveyId), this.metricSvc);
    return session;
  }

  closeCurrentSession() {
    if (!this.hasCurrentSession()) {
      return;
    }
    super.create(this.getCurrentSession());
    this.getCurrentSession().close();
    this.surveyNavigator = null;
  }

  recordNavigatedLocationInCurrentSession(location: string) {
    if (this.hasCurrentSession()) {
      this.getCurrentSession().addNavigatedLocation(location);
    } else {
      Utils.error("SessionService.recordNavigatedLocationInCurrentSession(): Attempted to call recordNavigatedLocationInCurrentSession with null currentSession");
    }
  }

  get(id: string, dontuseCache?: boolean) : Promise<Session> {
    return Promise.reject<Session>(ErrorType.UnsupportedOperation("get"));
  }

  list(dontuseCache?: boolean): Promise<Session[]> {
    return Promise.reject<Session[]>(ErrorType.UnsupportedOperation("list"));
  }

  getCached(id: string) :  Session{
    throw ErrorType.UnsupportedOperation("getCached");
  }

  listCached(): Session[] {
   throw ErrorType.UnsupportedOperation("listCached");
  }

  delete(id: string): Promise<void> {
    return Promise.reject<void>(ErrorType.UnsupportedOperation("delete"));
  }

  get scratchPad() {
    if (this.hasCurrentSession()){
      return this.surveyNavigator.scratchPad;
    }
    return null;
  }
}
