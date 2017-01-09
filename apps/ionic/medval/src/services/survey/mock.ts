import {Injectable} from "@angular/core";
import {Survey, WorkflowElement} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Config} from "../../shared/config";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";
import {ErrorType} from "../../shared/stuff/error.types";

@Injectable()
export class MockSurveyService extends AbstractMockService<Survey> {

  private static surveyMap: Map<string, Survey> = MockSurveyService.mockMap();

  constructor(
    utils: Utils,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider);
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

  validate(surveys: Survey[]): Error[] {
    return MockSurveyService.validateSurveys(surveys);
  }

  mockData() : Map<string, Survey> {
    return MockSurveyService.surveyMap;
  }

  private static mockMap() : Map<string, Survey> {
    let map : Map<string, Survey> = new Map<string, Survey>();
    map.set("default", Object.assign(new Survey(), {
      customerId: Config.CUSTOMERID,
      id: "default",
      entityStatus: "ACTIVE",
      properties: {
        name: "Short Survey",
        purpose: "Continuous Measurement",
        timeCommitment: "I have a minute"
      },
      workflowProperties: {
        showJokes: true,
        showWheel: true
      },
      workflow:[
        {
          id: 'start',
          component:"SingleMetricComponent",
          params:{
            metricId: "root"
          },
        },
        {
          id: 'detractor',
          fn:"StrongDetractor",
          params:{
            metricId: "root"
          },
          navigateOnResult: {
            "false": 'things.done.well',
            "true": 'unhappy'
          }
        },
        {
          id:'unhappy',
          component:"HandleComplaintComponent",
          isTerminal:true
        },
        {
          id:'things.done.well',
          component:"TopInfluencerComponent",
          params: {
            valueOrderDesc: true,
            maxMetrics: 4
          }
        },
        {
          id:'things.done.poorly',
          component:"TopInfluencerComponent",
          params: {
            valueOrderDesc: false,
            maxMetrics:4
          },
        },
        {
          id:'happy',
          fn:"StrongPromoter",
          params:{
            metricId: "root"
          },
          navigateOnResult: {
            "false": Infinity.toString(),
            "true": "request.review"
          }
        },
        {
          id:'request.review',
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
        name: "Medium Sized Survey",
        purpose: "In-visit survey",
        timeCommitment: "I have 2-3 minutes"
      },
      workflowProperties: {
        showJokes: true,
        showWheel: false,
      },
      workflow:[
        {
          id:'start',
          component:"SingleMetricComponent",
          params:{
            metricId: "root"
          },
        },
        {
          id:'strong.detractor.score',
          fn:"StrongDetractor",
          params:{
            metricId: "root"
          },
          navigateOnResult: {
            "false": "pick.staff",
            "true": "unhappy"
          }
        },
        {
          id:'unhappy',
          component:"HandleComplaintComponent",
          isTerminal:true
        },
        {
          id:'pick.staff',
          component:"PickStaffComponent",
          params: {
            roles: ["MD", "Orthodontic Assitant"]
          }
        },
        {
          id:'staff.nps',
          component:"ToplineForStaffComponent",
          executeIf: 'session.properties.selectedStaffUserNames.length > 0'
        },
        {
          id:'any.detractors',
          fn:"AnyDetractors",
          navigateOnResult: {
            "false": "things.done.poorly",
            "true": "unhappy"
          }
        },
        {
          id:'things.done.poorly',
          component:"TopInfluencerComponent",
          params: {
            valueOrderDesc: false,
            maxMetrics:4,
            rootMetricId: null,
          },
        },
        {
          id:'things.done.well',
          component:"TopInfluencerComponent",
          params: {
            valueOrderDesc: true,
            maxMetrics: 4,
            rootMetricId: null
          }
        },
        {
          id:'all.promoter.scores',
          fn: "AllPromoters",
          navigateOnResult: {
            "true": "request.review",
            "false": Infinity.toString() // end if false.
          }
        },
        {
          id:'request.review',
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
        name: "Full Survey with CAHPS",
        purpose: "Six month survey",
        timeCommitment: "I have 5-6 minutes"
      },
      workflowProperties: {
        showJokes: false,
        showWheel: true,
        award:10,
        costPerUse: 2
      },
      workflow:[
        {
          id:'start',
          component:"SingleMetricComponent",
          params:{
            metricId: "root"
          },
        },
        {
          id:'pick.staff',
          component:"PickStaffComponent",
          params: {
            roles: ["MD", "OrthoAssitant"],
            displayCount: 5
          }
        },
        {
          id:'staff.nps',
          component:"ToplineForStaffComponent",
          executeIf: 'session.properties.selectedStaffUserNames.length > 0',
          params: {
            displayCount: 5
          }
        },
        {
          id: 'md.metrics',
          component:"MultimetricComponent",
          params: {
            message:`staffSvc.getOnly('MD') == null ? 'About the doctors at ' + account.properties.customerName
              : 'Tell us more about ' + staffSvc.getOnly('MD').displayName`,
            metricIds: [
              '2861045b4984805ae23df729dad97b',
              '861045b4984805ae213df729dad97b',
              '1045b4984805ae213df729dad97b',
              '045b4984805ae213df729dad97b',
            ]
          }
        },
        {
          id: 'front.desk.metrics',
          component:"MultimetricComponent",
          params: {
            message:"Tell us about the front-desk",
            metricIds: [
              '95a8659497274ffe9f8fb14fa45b21e5',
              '6e0f99cdd7a34a058ff2fb22fbe51738',
              '0f99cdd7a34a058ff2fb22fbe51738',
              '34182735427d4f2eba99eb0acb66078f',
            ]
          }
        },
        {
          id: 'assistant.metrics',
          component:"MultimetricComponent",
          params: {
            message:"'Tell us how the assistants (' + staffSvc.getStaffFirstNamesInRole('Orthodontic Assistant') + ') are doing'",
            metricIds: [
              '2861045b4985ae23df729dad97b',
              '861045b4984ae213df729dad97b',
              '1045b4984ae213df729dad97b',
              '045b498ae213df729dad97b',
            ]
          }
        },
        {
          id: 'all.promoters',
          fn:"AllPromoters",
          navigateOnResult: {
            "false": "any.detractors",
            "true": "happy"
          }
        },
        {
          id: 'happy',
          component:"RequestReviewComponent2",
          isTerminal:true
        },
        {
          id: 'any.detractors',
          fn:"AnyDetractors",
          navigateOnResult: {
            "false": Infinity,
            "true": "unhappy"
          }
        },
        {
          id: 'unhappy',
          component:"HandleComplaintComponent",
          isTerminal:true,
          params: {
            title: "account.properties.customerName + ' can do better'"
          }
        },
      ]
    }));
    let errors = MockSurveyService.validateSurveys(Array.from(map.values()));
    if (errors.length > 0) {
      Utils.error(errors.toString());
    };
    return map;
  }

  static validateSurveys(surveys: Survey[]): Error[] {
    let errors: Error[] = [];
    surveys.forEach((survey: Survey)=>{
      if (!survey.id) {
        errors.push((new Error(Utils.format("Survey has null id. Survey: {0}", Utils.stringify(survey)))));
      }
      let ids: Set<string> = new Set<string>();
      survey.workflow.forEach((value: WorkflowElement)=> {
        if (ids.has(value.id)) {
          errors.push(ErrorType.EntityValidationError("Duplicate id found; a dup elements is: {0} in survey id {1}",
            Utils.stringify(value), survey.id));
        }
        if (!value['fn'] && !value['component']) {
          errors.push(ErrorType.EntityValidationError("workflow elements must have either 'component' or 'fn' attribute"));
        }
      })
    })
    return errors;
  }
}
