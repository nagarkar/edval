import {Injectable} from "@angular/core";
import {Session} from "./schema";
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockSessionService} from "./mock";
import {Utils} from "../../shared/stuff/utils";
import {SurveyNavigator} from "../survey/survey.navigator";
import {SurveyService} from "../survey/delegator";
import {MetricService} from "../metric/delegator";
import {RegisterService} from "../service.factory";
import {LiveSessionService} from "./live";

@Injectable()
@RegisterService
export class SessionService extends DelegatingService<Session> {

  surveyNavigator: SurveyNavigator;

  constructor(
    mockService: MockSessionService,
    liveService: LiveSessionService,
    //liveService: DDBSessionService,
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
    return Promise.reject<Session>(Utils.unsupportedOperationError("get", this));
  }

  list(dontuseCache?: boolean): Promise<Session[]> {
    return Promise.reject<Session[]>(Utils.unsupportedOperationError("list", this));
  }

  getCached(id: string) :  Session{
    throw Utils.logAndThrow(Utils.unsupportedOperationError("getCached", this));
  }

  listCached(): Session[] {
   throw Utils.logAndThrow(Utils.unsupportedOperationError("listCached", this));
  }

  delete(id: string): Promise<void> {
    return Promise.reject<void>(Utils.unsupportedOperationError("delete", this));
  }

  get scratchPad() {
    if (this.hasCurrentSession()){
      return this.surveyNavigator.scratchPad;
    }
    return null;
  }
}
