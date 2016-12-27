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
      workflowProperties: {
        showJokes: true,
        showWheel: true,
      },
      workflow:[
        {
          component:"PickStaffComponent",
          params: {
            roles: ["Orthodontic Assistant", "MD", "FrontOffice"]
          }
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
          component:"RequestReviewComponent2",
          isTerminal:true
        }
      ]
    }));
    map.set("twominute", Object.assign(new Survey(), {
      customerId: Config.CUSTOMERID,
      id: "twominute",
      entityStatus: "ACTIVE",
      properties: {
        name: "Short Survey",
        purpose: "2 minute in-visit survey",
        timeCommitment: "I have 2 minutes"
      },
      workflowProperties: {
        showJokes: true,
        showWheel: true,
      },
      workflow:[
        {
          component:"ToplineForStaffComponent",
          executeIf: 'session.properties.selectedStaffUserNames.length > 0'
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
          component:"PickStaffComponent",
          params: {
            roles: ["MD", "Orthodontic Assitant"]
          }
        },
        {
          component:"ToplineForStaffComponent",
          executeIf: 'session.properties.selectedStaffUserNames.length > 0'
        },
        {
          fn:"AnyDetractors",
          navigateOnResult: {
            "false": 1,
            "true": -3
          }
        },
        {
          component:"TopInfluencerComponent",
          params: {
            valueOrderDesc: false,
            maxMetrics:4,
            rootMetricId: null,
          },
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
          fn: "AllPromoters",
          navigateOnResult: {
            "true": 1,
            "false": Infinity // end if false.
          }
        },
        {
          component:"RequestReviewComponent2",
          isTerminal:true
        },
      ]
    }));
    map.set("full", Object.assign(new Survey(), {
      customerId: Config.CUSTOMERID,
      id: "full",
      entityStatus: "ACTIVE",
      properties: {
        name: "Full Survey",
        purpose: "5 minute survey (provide every six months)",
        timeCommitment: "I have 5 minutes"
      },
      workflowProperties: {
        showJokes: true,
      },
      workflow:[
        {
          component:"SingleMetricComponent",
          params:{
            metricId: "root"
          },
        },
        {
          component:"PickStaffComponent",
          params: {
            roles: ["MD", "OrthoAssitant"]
          }
        },
        {
          component:"ToplineForStaffComponent",
          executeIf: 'session.properties.selectedStaffUserNames.length > 0'
        },
        {
          component:"MultimetricComponent",
          params: {
            message:'Tell us about how the doctor & staff are doing',
            metricIds: [
              '2861045b4984805ae23df729dad97b',
              '861045b4984805ae213df729dad97b',
              '1045b4984805ae213df729dad97b',
              '045b4984805ae213df729dad97b',
            ]
          }
        },
        {
          component:"MultimetricComponent",
          params: {
            message:'Tell us about the front-desk and other support staff',
            metricIds: [
              '95a8659497274ffe9f8fb14fa45b21e5',
              '6e0f99cdd7a34a058ff2fb22fbe51738',
              '0f99cdd7a34a058ff2fb22fbe51738',
              '34182735427d4f2eba99eb0acb66078f',
            ]
          }
        },
        {
          fn:"AllPromoters",
          navigateOnResult: {
            "false": 2,
            "true": 1
          }
        },
        {
          component:"RequestReviewComponent2",
          isTerminal:true
        },
        {
          fn:"AnyDetractors",
          navigateOnResult: {
            "false": Infinity,
            "true": 1
          }
        },
        {
          component:"HandleComplaintComponent",
          isTerminal:true
        },
      ]
    }));
    return map;
  }
}
