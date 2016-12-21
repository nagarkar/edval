import {Injectable} from '@angular/core';
import {Survey} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Config} from "../../shared/aws/config";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";

@Injectable()
export class MockSurveyService extends AbstractMockService<Survey> {

  private static surveyMap: Map<string, Survey> = MockSurveyService.mockMap();

  constructor(
    utils: Utils,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider);
    Utils.log("created survey)");
  }

  reset() {
    MockSurveyService.surveyMap = MockSurveyService.mockMap();
  }

  getId(member: Survey) {
    return member.id;
  }

  setId(member: Survey, id: string): string {
    return member.id = id;
  }

  public mockData() : Map<string, Survey> {
    return MockSurveyService.surveyMap;
  }

  private static mockMap() : Map<string, Survey> {
    let map : Map<string, Survey> = new Map<string, Survey>();
    map.set("default", Object.assign(new Survey(), {
      customerId: Config.CUSTOMERID,
      id: "default",
      entityStatus: "ACTIVE",
      properties: {
        name: "CAHPS Survey",
        purpose: "CAHPS-equivalent survey",
        timeCommitment: "I have a minute"
      },
      workflow:[
        {
          component:"RequestReviewComponent",
          isTerminal:true
        },
        {
          component:"SingleMetricComponent",
          params:{
            metricId: "root"
          },
        },
        {
          fn:"StrongDetractor",
          params:{
            metricId: "root"
          },
          navigateOnResult: {
            "false": 2,
            "true": 1
          }
        },
        {
          component:"HandleComplaintComponent",
          isTerminal:true
        },
        {
          fn:"StrongPromoter",
          params:{
            metricId: "root"
          },
          navigateOnResult: {
            "false": 1,
            "true": 2
          }
        },
        {
          component:"TopInfluencerComponent",
          params: {
            valueOrderDesc: false,
            maxMetrics:4,
            rootMetricId: null,
          },
          isTerminal:true
        },
        {
          component:"TopInfluencerComponent",
          params: {
            valueOrderDesc: true,
            maxMetrics: 4,
            rootMetricId: null
          }
        },
        {
          component:"RequestReviewComponent",
          isTerminal:true
        }
      ]
    }));
    map.set("fullsurvey", Object.assign(new Survey(), {
      customerId: Config.CUSTOMERID,
      id: "fullsurvey",
      entityStatus: "ACTIVE",
      properties: {
        name: "Short Survey",
        purpose: "5 minute in-visit survey",
        timeCommitment: "I have 5 minutes"
      },
      workflow:[
        // 1
        {
          component:"SingleMetric",
          params:{
            metricId: "root"
          },
        },
        // 2
        {
          component:"PickStaffComponent",
          params: {
            roles: ["MD", "OrthoAssitant"]
          }
        },
        // 3
        {
          component:"StaffNPSComponent",
          params: {
            staffIndex:0
          },
          navigateOnException:5
        },
        // 4
        {
          component:"StaffNPSComponent",
          params: {
            staffIndex:1
          },
          navigateOnException:5
        },
        // 5
        {
          component: "QuestionBank",
          params: {
            sampleSize:4,
            metrics: [
              // Add your list of metric ids here.
            ]
          }
        },
        // 6
        {
          component: "QuestionBank",
          params: {
            sampleSize:4,
            role: "FrontDesk"
          }
        },
        // 7
        {
          fn: "AllNPSPromoters",
          navigateOnResult: {
            "true": 8,
            "false": 9
          }
        },
        // 8
        {
          component:"RequestReviewComponnet",
          isTerminal:true
        },
        // 9
        {
          fn: "AnyStrongDetractors",
          navigateOnResult: {
            "true": 10,
            "false": -1 // terminal
          }
        },
        // 10
        {
          component: "DiffuseSituationComponent",
          isTerminal:true
        }
      ]
    }));
    return map;
  }
}
