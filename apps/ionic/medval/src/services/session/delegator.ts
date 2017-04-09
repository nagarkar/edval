/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
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
import {Config} from "../../shared/config";
import {SessionScrubber} from "../../shared/scrubberservices/session.scrubber";
import {StaffService} from "../staff/delegator";

@Injectable()
@RegisterService
export class SessionService extends DelegatingService<Session> {

  surveyNavigator: SurveyNavigator;

  constructor(
    mockService: MockSessionService,
    liveService: LiveSessionService,
    private surveyService: SurveyService,
    private metricSvc: MetricService,
    private staffSvc: StaffService,
    private sessionScrubber: SessionScrubber) {

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
    Config.LAST_SESSION_CREATED = Date.now();
    return session;
  }

  closeCurrentSession() {
    if (!this.hasCurrentSession()) {
      return;
    }
    let session: Session =this.getCurrentSession();
    session.readyToSave();
    this.sessionScrubber.scrub(session);
    this.updateWithRetries(session, Config.SESSION_SAVE_RETRY_TIME, Config.SESSION_RETRIES);
    this.surveyNavigator = null;
  }

  updateWithRetries(session: Session, delay: number, retries: number): Promise<Session> {

    if (retries < 0 || !session || !delay) {
      Utils.errorAndThrow(new Error("Invalid input in updateWithRetries"));
    }
    return new Promise((resolve, reject)=>{
      if (retries < 0) {
        reject("Exhausted Retries")
        return;
      }
      super.update(session)
        .then((session: Session)=>{
          resolve(session);
          return session;
        })
        .catch((err)=>{
          retries--;
          setTimeout(()=>{
            this.updateWithRetries(session, delay * Config.BACKOFF_MULTIPLIER, retries)
              .then((session: Session)=>{
                resolve(session);
                return session;
              })
          }, delay)
        })
    });
  }

  recordNavigatedLocationInCurrentSession(location: string) {
    if (this.hasCurrentSession()) {
      this.getCurrentSession().addNavigatedLocation(location);
    } else {
      Utils.error("CampaignService.recordNavigatedLocationInCurrentSession(): Attempted to call recordNavigatedLocationInCurrentSession with null currentSession");
    }
  }

  list(dontuseCache?: boolean): Promise<Session[]> {
    return Promise.reject<Session[]>(Utils.unsupportedOperationError("list", this));
  }

  listCached(): Session[] {
   throw Utils.errorAndThrow(Utils.unsupportedOperationError("listCached", this));
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
