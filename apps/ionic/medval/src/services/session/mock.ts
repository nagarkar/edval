/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Session} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";

@Injectable()
export class MockSessionService extends AbstractMockService<Session> {

  private static data: Map<string, Session> = new Map<string, Session>();

  constructor(
    utils: Utils,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider);
    Utils.log("Created Mock Session Service object)");
  }

  reset() {
    MockSessionService.data = new Map<string, Session>();
  }

  setId(member: Session, id: string): string {
    return member.sessionId = id;
  }

  getId(member: Session) {
    return member.sessionId;
  }

  public mockData() : Map<string, Session> {
    return MockSessionService.data;
  }
}
