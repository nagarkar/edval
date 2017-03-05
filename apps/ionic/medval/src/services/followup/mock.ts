/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {SessionFollowup, TaskNames, FollowupTaskState} from "./schema";
import {Config} from "../../shared/config";
import {Injectable} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";

@Injectable()
export class MockSessionFollowupService extends AbstractMockService<SessionFollowup> {

  private static TODAY_9AM: number = new Date().setHours(8);
  private static YESTERDAY_12AM: number = new Date(new Date().getTime() - 86400000).setHours(11);

  private static followupMap: Map<string, SessionFollowup> = MockSessionFollowupService.mockMap();

  constructor(utils: Utils,
              accessProvider: AccessTokenService) {

    super(utils, accessProvider);
  }

  reset() {
    MockSessionFollowupService.followupMap = MockSessionFollowupService.mockMap();
  }

  setId(member: SessionFollowup, id: string): string {
    return member.compositeKey = id;
  }

  getId(member: SessionFollowup) {
    return member.compositeKey;
  }

  public mockData(): Map<string, SessionFollowup> {
    return MockSessionFollowupService.followupMap;
  }

  private static mockMap(): Map<string, SessionFollowup> {
    let map: Map<string, SessionFollowup> = new Map<string, SessionFollowup>();
    MockSessionFollowupService.getFollowups().forEach((untypedFollowup: any) => {
      const fu: SessionFollowup = Object.assign<SessionFollowup, any>(new SessionFollowup(), untypedFollowup);
      fu.generateSetCompositeKey();
      map.set(fu.compositeKey, fu);
    });
    return map;
  }

  // MD Questions
  // NPS Parent
  static getFollowups(): any[] {
    return [
      {
        customerId: Config.CUSTOMERID,
        sessionId : MockSessionFollowupService.YESTERDAY_12AM,
        taskName: TaskNames.EMAIL_REVIEW_REMINDER,
        taskState: FollowupTaskState.NOT_INITIATED,
        instanceId: "0",
      },
      {
        customerId: Config.CUSTOMERID,
        sessionId : MockSessionFollowupService.YESTERDAY_12AM,
        taskName: TaskNames.SMS_REVIEW_REMINDER,
        taskState: FollowupTaskState.INITIATED,
        instanceId: "0",
      },
      {
        customerId: Config.CUSTOMERID,
        sessionId : MockSessionFollowupService.YESTERDAY_12AM,
        taskName: TaskNames.STANDARD_FOLLOWUP,
        taskState: FollowupTaskState.COMPLETE,
        instanceId: "0",
      },
      {
        customerId: Config.CUSTOMERID,
        sessionId : MockSessionFollowupService.TODAY_9AM,
        taskName: TaskNames.STANDARD_FOLLOWUP,
        taskState: FollowupTaskState.NOT_INITIATED,
        instanceId: "0",
      },
      {
        customerId: Config.CUSTOMERID,
        sessionId : MockSessionFollowupService.TODAY_9AM,
        taskName: TaskNames.TARGETED_FOLLOWUP,
        taskState: FollowupTaskState.INITIATED,
        instanceId: "0",
      },
    ];
  }

}
