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
    Utils.log("created staff account)");
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
