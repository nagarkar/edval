import {Injectable} from '@angular/core';
import { Session} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Config} from "../../shared/aws/config";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";

@Injectable()
export class MockSessionService extends AbstractMockService<Session> {

  private static staffMap: Map<string, Session> = MockSessionService.mockMap();

  constructor(
    utils: Utils,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider);
    this.utils.log("created staff account)");
  }


  getId(member: Session) {
    return member.sessionId;
  }

  public mockData() : Map<string, Session> {
    return MockSessionService.staffMap;
  }


  private static mockMap() : Map<string, Session> {
    let map : Map<string, Session> = new Map<string, Session>();
    map.set("1234", Object.assign(new Session(), {
        sessionId:"1234",
        patientId:"sdf",

    }));
    return map;
  }
}
