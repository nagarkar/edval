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
        avgSteps: 3,
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
            "false": 'happy',
            "true": 'unhappy'
          }
        },
        {
          id:'unhappy',
          component:"PickMetricGroups",
          params: {
            title:`"What part of your experience " + account.customerName + " was the least satisfying?"`,
            selectedStyle: {
              fillStyle: "rgba(255, 0, 0, .1)",
              shadowColor: '#C0B'
            },
            graphicalMetricGroupIndicators: {
              imgSrc: "assets/img/patient_journey.png",
              metricGroups: [{
                coords: "222,398,238,391,252,359,298,366,318,351,347,359,370,346,387,356,418,346,441,367,467,375,466,393,477,418,436,432,422,456,386,455,344,472,315,466,279,467,250,453,223,445,221,422,211,409",
                metricIds:"95a8659497274ffe9f8fb14fa45b21e5, 6e0f99cdd7a34a058ff2fb22fbe51738, 0f99cdd7a34a058ff2fb22fbe51738, 34182735427d4f2eba99eb0acb66078f"
              }, {
                coords: "589,399,599,378,609,382,619,358,642,350,672,354,691,341,711,346,735,338,758,342,790,342,807,354,825,365,828,385,834,407,803,427,783,446,751,444,717,465,677,455,643,455,619,445,592,430,596,413",
                metricIds:"95a8659497274ffe9f8fb14fa45b21e5, 6e0f99cdd7a34a058ff2fb22fbe51738, 0f99cdd7a34a058ff2fb22fbe51738, 34182735427d4f2eba99eb0acb66078f"
              }, {
                coords: "455,300,423,305,398,290,371,279,373,259,363,244,374,224,385,225,398,200,431,193,443,197,461,188,491,192,510,184,531,188,558,184,580,200,603,217,598,232,611,249,596,267,573,272,560,295,529,296,501,314",
                metricIds:"045b498ae213df729dad97b, 1045b4984ae213df729dad97b, 861045b4984ae213df729dad97b, 2861045b4985ae23df729dad97b"
              }, {
                coords: "591,142,559,146,537,134,514,124,513,108,507,97,513,81,527,80,532,60,556,56,577,56,596,48,618,51,637,48,659,51,687,47,706,60,724,74,719,84,730,100,701,120,686,135,658,136,630,151,607,148",
                metricIds:"045b4984805ae213df729dad97b, 1045b4984805ae213df729dad97b, 861045b4984805ae213df729dad97b, 2861045b4984805ae23df729dad97b"
              }, {
                coords: "397,79,395,104,353,100,334,118,291,107,253,111,239,100,214,91,213,74,205,56,227,43,237,24,266,22,281,25,299,14,320,18,342,9,358,18,386,11,406,26,425,38,423,52,428,65,418,81,399,83",
                metricIds:"95a8659497274ffe9f8fb14fa45b21e5, 6e0f99cdd7a34a058ff2fb22fbe51738, 0f99cdd7a34a058ff2fb22fbe51738, 34182735427d4f2eba99eb0acb66078f"
              }]
            }
          }
        },
        {
          id:'unhappy.things.done.poorly',
          component:"TopInfluencerComponent",
          params: {
            title: [
              "Looks like there is room for improvement...",
              `"Can you pick one or two areas where " + account.properties.customerName + " can do better?"`
            ],
            valueOrderDesc: false,
            maxMetrics: 4,
            numSelections: 0
          }
        },
        {
          component:"HandleComplaintComponent",
          isTerminal:true,
          params: {
            title: null, // Explicitly don't show the title.
          }
        },
        {
          id:'happy',
          fn:"StrongPromoter",
          params:{
            metricId: "root"
          },
          navigateOnResult: {
            "false": "things.done.well",
            "true": "best.areas.of.performance"
          }
        },
        {
          id:'best.areas.of.performance',
          component:"PickMetricGroups",
          params: {
            iconName: 'checkmark-circle',
            color: 'green',
            selectedStyle: {
              fillStyle: "rgba(0, 255, 0, .1)",
              shadowColor: '#333'
            },
            title:`"What part of your experience " + account.customerName + " was the most satisfying?"`,
            graphicalMetricGroupIndicators: {
              imgSrc: "assets/img/patient_journey.png",
              metricGroups: [{
                coords: "222,398,238,391,252,359,298,366,318,351,347,359,370,346,387,356,418,346,441,367,467,375,466,393,477,418,436,432,422,456,386,455,344,472,315,466,279,467,250,453,223,445,221,422,211,409",
                metricIds:"95a8659497274ffe9f8fb14fa45b21e5, 6e0f99cdd7a34a058ff2fb22fbe51738, 0f99cdd7a34a058ff2fb22fbe51738, 34182735427d4f2eba99eb0acb66078f"
              }, {
                coords: "589,399,599,378,609,382,619,358,642,350,672,354,691,341,711,346,735,338,758,342,790,342,807,354,825,365,828,385,834,407,803,427,783,446,751,444,717,465,677,455,643,455,619,445,592,430,596,413",
                metricIds:"95a8659497274ffe9f8fb14fa45b21e5, 6e0f99cdd7a34a058ff2fb22fbe51738, 0f99cdd7a34a058ff2fb22fbe51738, 34182735427d4f2eba99eb0acb66078f"
              }, {
                coords: "455,300,423,305,398,290,371,279,373,259,363,244,374,224,385,225,398,200,431,193,443,197,461,188,491,192,510,184,531,188,558,184,580,200,603,217,598,232,611,249,596,267,573,272,560,295,529,296,501,314",
                metricIds:"045b498ae213df729dad97b, 1045b4984ae213df729dad97b, 861045b4984ae213df729dad97b, 2861045b4985ae23df729dad97b"
              }, {
                coords: "591,142,559,146,537,134,514,124,513,108,507,97,513,81,527,80,532,60,556,56,577,56,596,48,618,51,637,48,659,51,687,47,706,60,724,74,719,84,730,100,701,120,686,135,658,136,630,151,607,148",
                metricIds:"045b4984805ae213df729dad97b, 1045b4984805ae213df729dad97b, 861045b4984805ae213df729dad97b, 2861045b4984805ae23df729dad97b"
              }, {
                coords: "397,79,395,104,353,100,334,118,291,107,253,111,239,100,214,91,213,74,205,56,227,43,237,24,266,22,281,25,299,14,320,18,342,9,358,18,386,11,406,26,425,38,423,52,428,65,418,81,399,83",
                metricIds:"95a8659497274ffe9f8fb14fa45b21e5, 6e0f99cdd7a34a058ff2fb22fbe51738, 0f99cdd7a34a058ff2fb22fbe51738, 34182735427d4f2eba99eb0acb66078f"
              }]
            }
          }
        },
        {
          id:'things.done.really.well',
          component:"TopInfluencerComponent",
          params: {
            title: [
              `"That's encouraging for " + account.properties.customerName + "!"`,
              `"Can you rank one or two things that are going exceptionally well?"`
            ],
            valueOrderDesc: true,
            maxMetrics: 4
          }
        },
        {
          id:'happy2',
          fn:"StrongPromoter",
          params:{
            metricId: "root"
          },
          navigateOnResult: {
            "false": "things.done.well",
            "true": "request.review"
          }
        },
        {
          id:'things.done.well',
          component:"TopInfluencerComponent",
          params: {
            title: [
              `"What is the " + account.properties.customerName + " team doing well?"`
            ],
            valueOrderDesc: true,
            maxMetrics: 4
          }
        },
        {
          id:'things.done.poorly',
          isTerminal:true,
          component:"TopInfluencerComponent",
          params: {
            title: `"What can " + account.properties.customerName + " improve?"`,
            valueOrderDesc: false,
            maxMetrics: 4
          }
        },
        {
          id:'request.review',
          component:"RequestReviewComponent2",
          isTerminal:true
        },
      ]
    }));
    /*
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
        avgSteps: 5,
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
            title: `"What can " + account.properties.customerName + " improve?"`,
            valueOrderDesc: false,
            maxMetrics:4,
            rootMetricId: null,
          },
        },
        {
          id:'things.done.well',
          component:"TopInfluencerComponent",
          params: {
            title: `"What is " + account.properties.customerName + " doing well"`,
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
    */
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
        avgSteps: 6,
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
            roles: ["DDS", "OrthoAssitant"],
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
            message:`staffSvc.getOnly('DDS') == null ? 'About the doctors at ' + account.properties.customerName
              : 'Tell us more about ' + staffSvc.getOnly('DDS').displayName`,
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
          fn:"AveragePromoterScore",
          navigateOnResult: {
            "true": "happy",
            "false": Infinity.toString()
          }
        },
        {
          id: 'happy',
          component:"RequestReviewComponent2",
          isTerminal:true
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
