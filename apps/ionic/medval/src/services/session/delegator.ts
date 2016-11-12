import {Injectable} from '@angular/core';

import {Session} from './schema';
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockSessionService} from "./mock";
import {LiveSessionService} from "./live";
import {ErrorType} from "../../shared/stuff/error.types";
import {MetricValue} from "../metric/schema";
import {Utils} from "../../shared/stuff/utils";

@Injectable()
export class SessionService extends DelegatingService<Session> {

  private currentSession: Session;

  constructor(
    mockService: MockSessionService,
    liveService: LiveSessionService) {

    super(mockService, liveService);
  }

  getCurrentSession(): Session {
    return this.currentSession;
  }

  newCurrentSession() {
    this.currentSession = new Session();
    super.create(this.currentSession);
  }

  closeCurrentSession() {
    this.currentSession.close();
    super.update(this.currentSession);
    Utils.log("Setting session to null. Session: {0}", this.currentSession);
    this.currentSession = null;
  }

  addToCurrentSession(subject: string, metricValue: MetricValue) {
    this.currentSession.addMetricValue(subject, metricValue);
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
