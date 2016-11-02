import {Injectable} from '@angular/core';

import {Session} from './schema';
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockSessionService} from "./mock";
import {LiveSessionService} from "./live";
import {ErrorType} from "../../shared/stuff/error.types";
import {MetricValue} from "../metric/schema";

@Injectable()
export class SessionService extends DelegatingService<Session> {

  private sessions: Array<Session> = [];

  constructor(
    mockService: MockSessionService,
    liveService: LiveSessionService) {

    super(mockService, liveService);

    setTimeout(()=>{
      if (this.multiplePendingSessions()) {
        this.closePendingSessions();
      }
    }, 6*1000 /* TODO: Increase to 10 minutes.*/)
  }

  getId(member: Session): string {
    return member.sessionId;
  }

  create(session: Session): Promise<Session> {
    return super.create(session)
      .then((session: Session) => {
        this.sessions.push(session);
      });
  }

  update(session: Session): Promise<Session> {
    if (!this.sameAsCurrentSession(session)) {
      Promise.reject(ErrorType.UnsupportedOperation(
        "Can't call update(session) for a session that hasn't been called using create(session) first."));
    }
    return super.update(session);
  }

  sameAsCurrentSession(session: Session) {
    let currentSession = this.getCurrentSession();
    return currentSession && (session.sessionId == currentSession.sessionId);
  }

  addToCurrentSession(value: MetricValue) {
    //TODO Uncomment this once we fix sessions.
    //this.getCurrentSession().addMetricValue(value);
  }

  getCurrentSession() : Session {
    if (this.sessions.length > 0) {
      return Object.assign<Session, any>(new Session(), this.sessions[this.sessions.length -1]);
    }
  }

  closePendingSessions() {
    //TODO Uncomment this once we fix sessions.
    /*
    let currentSession = this.getCurrentSession();
    this.sessions.forEach((session: Session) => {
      if (!session.equals(currentSession)) {
        session.close();
        this.update(session);
      }
    })
    */
  }

  closeCurrentSession() {
    //TODO Uncomment this once we fix sessions.
    /*
    let currentSession = this.getCurrentSession();
    currentSession.close();
    this.update(currentSession);
    this.sessions.pop(); // remove the session from the stack.
    */
  }

  multiplePendingSessions(): boolean {
    return this.sessions.length > 2;
  }
}
