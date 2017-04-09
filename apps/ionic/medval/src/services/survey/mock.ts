/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Survey, WorkflowElement} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/config";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";
import {ErrorType} from "../../shared/stuff/error.types";

@Injectable()
export class MockSurveyService extends AbstractMockService<Survey> {

  private surveyMap: Map<string, Survey>;

  constructor() {

    super();
  }

  reset(): Promise<any>  {
    this.surveyMap = MockSurveyService.mockMap();
    return Promise.resolve();
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
    return this.surveyMap;
  }

  private static mockMap() : Map<string, Survey> {
    let map : Map<string, Survey> = new Map<string, Survey>();
    map.set("default", Object.assign(new Survey(), {
      customerId: Config.CUSTOMERID,
      id: "default",
      entityStatus: "ACTIVE",
      properties: {
        name: "Default",
        purpose: "Continuous Measurement",
        description: `This is the default, short, 1 minute survey. If you are in survey mode, 
          you will see this option if a survey is completed and cycles back, or if a survey times out. This survey
          is designed to adjust based on responses. If patients provide a detractor response (less than 4 out of 5 stars)
           for the first question on overal favorability, we ask fewer questions. If the patient provides 5/5 stars on overall favorability,
           we ask for a review. For more information about how this app helps you capture reviews and handle unhappy customers
            proactively, please see the application notes.`
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
            title:[`"What part of your experience was the least satisfying?"`],
            selectedStyle: {
              fillStyle: "rgba(255, 0, 0, .1)",
              shadowColor: '#C0B'
            },
            graphicalMetricGroupIndicators: {
              imgSrc: "assets/img/journeymap.png",
              metricGroups: [{
                coords: "483,371,503,361,520,359,533,366,547,359,562,359,577,363,589,359,606,358,623,363,632,373,648,380,655,390,655,400,662,414,657,429,645,441,626,444,620,456,601,464,584,466,571,463,559,476,533,481,510,478,494,469,476,473,449,469,432,459,406,451,403,437,410,431,396,420,398,407,420,398,425,380,455,366",
                metricIds:"95a8659497274ffe9f8fb14fa45b21e5, 6e0f99cdd7a34a058ff2fb22fbe51738, 0f99cdd7a34a058ff2fb22fbe51738, 34182735427d4f2eba99eb0acb66078f"
              }, {
                coords: "419,230,419,218,426,211,435,204,447,201,459,203,472,204,481,197,493,196,505,192,516,196,530,192,547,189,560,196,571,192,588,191,601,194,610,208,623,209,630,221,630,231,637,248,633,260,620,272,604,277,601,289,579,297,555,297,545,308,525,314,501,311,488,302,462,308,442,302,430,291,408,286,401,274,403,258,398,247,403,235",
                metricIds:"045b4984805ae213df729dad97b, 1045b4984805ae213df729dad97b, 861045b4984805ae213df729dad97b, 2861045b4984805ae23df729dad97b"
              }, {
                coords: "486,129,467,133,440,129,432,117,413,114,401,102,406,89,398,77,401,63,413,56,420,46,428,33,445,28,464,26,476,29,489,17,503,17,521,23,535,14,549,16,560,19,579,16,598,17,610,29,626,38,632,48,632,58,637,72,635,87,621,99,604,104,601,114,589,122,566,122,555,117,552,128,542,136,521,141,499,138",
                metricIds:"045b498ae213df729dad97b, 1045b4984ae213df729dad97b, 861045b4984ae213df729dad97b, 2861045b4985ae23df729dad97b"
              }]
            }
          }
        },
        {
          id:'unhappy.things.done.poorly',
          component:"TopInfluencerComponent",
          params: {
            title: [
              "Thanks for your candid feedback; there is certainly room for improvement",
              `"Can you please pick one or two specific areas where things could have gone better?"`
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
            title: [`"What part of your experience was the most satisfying?"`],
            graphicalMetricGroupIndicators: {
              imgSrc: "assets/img/journeymap.png",
              metricGroups: [{
                coords: "483,371,503,361,520,359,533,366,547,359,562,359,577,363,589,359,606,358,623,363,632,373,648,380,655,390,655,400,662,414,657,429,645,441,626,444,620,456,601,464,584,466,571,463,559,476,533,481,510,478,494,469,476,473,449,469,432,459,406,451,403,437,410,431,396,420,398,407,420,398,425,380,455,366",
                metricIds:"95a8659497274ffe9f8fb14fa45b21e5, 6e0f99cdd7a34a058ff2fb22fbe51738, 0f99cdd7a34a058ff2fb22fbe51738, 34182735427d4f2eba99eb0acb66078f"
              }, {
                coords: "419,230,419,218,426,211,435,204,447,201,459,203,472,204,481,197,493,196,505,192,516,196,530,192,547,189,560,196,571,192,588,191,601,194,610,208,623,209,630,221,630,231,637,248,633,260,620,272,604,277,601,289,579,297,555,297,545,308,525,314,501,311,488,302,462,308,442,302,430,291,408,286,401,274,403,258,398,247,403,235",
                metricIds:"045b4984805ae213df729dad97b, 1045b4984805ae213df729dad97b, 861045b4984805ae213df729dad97b, 2861045b4984805ae23df729dad97b"
              }, {
                coords: "486,129,467,133,440,129,432,117,413,114,401,102,406,89,398,77,401,63,413,56,420,46,428,33,445,28,464,26,476,29,489,17,503,17,521,23,535,14,549,16,560,19,579,16,598,17,610,29,626,38,632,48,632,58,637,72,635,87,621,99,604,104,601,114,589,122,566,122,555,117,552,128,542,136,521,141,499,138",
                metricIds:"045b498ae213df729dad97b, 1045b4984ae213df729dad97b, 861045b4984ae213df729dad97b, 2861045b4985ae23df729dad97b"
              }]
            }
          }
        },
        {
          id:'things.done.really.well',
          component:"TopInfluencerComponent",
          params: {
            title: [
              `"Thanks! " + (account.properties.customerName ? account.properties.customerName: 'Our Team') + " would like to build on this strength!"`,
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
              `"What is " + (account.properties.customerName ? account.properties.customerName: 'our Team') + " doing well?"`
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
            title: [`"What can " + (account.properties.customerName ? account.properties.customerName: 'our Team') + " improve?"`],
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
    map.set("full", Object.assign(new Survey(), {
      customerId: Config.CUSTOMERID,
      id: "full",
      entityStatus: "ACTIVE",
      properties: {
        name: "CAHPS based",
        purpose: "Six month survey",
        description: `This survey is based on CAHPS and takes about 5 minutes to complete. 
          It includes questions to cover <a href='https://www.ahrq.gov/cahps/surveys-guidance/dental/about/survey-measures.html'>CAHPS</a> requirements but is not
          a replacement for an official CAHPS survey (contact us to learn more about this). Patients could be reasonably expected 
          to provide this survey every six months to a year. The survey includes questions about doctors, their assistants and the Front office. If
          you have configured staff in the Administrative Dashboard, patients are also asked who they worked with and all metrics are tracked by staff member.
          This survey option does not show by default. You see this option if you arrive on this page from the Dashboard. 
          If you are in survey mode, you can tap the 'toolbar' icon on the top right of your screen to see this option.`
      },
      workflowProperties: {
        avgSteps: 6,
        showJokes: false,
        showWheel: true,
        award:5,
        costPerUse: 1
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
            message: `'Who have you worked with/Who did you see today?'`,
            roles: ["DDS", "Orthodontic Assistant", "FrontOffice"],
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
            message:`onlyStaff ? 'Tell us more about ' + onlyStaff.displayName
              : 'About the doctors ' + (account.properties.customerName? 'at ' + account.properties.customerName : 'in our team')`,
            rootMetricId:'62861045b4984805ae213df729dad97b'
          }
        },
        {
          id: 'assistant.metrics',
          component:"MultimetricComponent",
          params: {
            message:`onlyStaff ? 'Tell us how ' + onlyStaff.displayName + ' is doing as the Dental Assistant'
              : 'Tell us how the assistants ' 
                  + (staffSvc.getStaffNamesInListForRole(staff, role)? 
                      '(' + staffSvc.getStaffNamesInListForRole(staff, role) + ')' : ''
                    )
                  + ' are doing'`,
            rootMetricId:'62861045b4984805213df729dad97b'
          }
        },
        {
          id: 'front.desk.metrics',
          component:"MultimetricComponent",
          params: {
            message:`onlyStaff ? 'Tell us how ' + onlyStaff.displayName + ' is doing in the front-office'
              : 'Tell us how the front-office ' 
                  + (staffSvc.getStaffNamesInListForRole(staff, role)? 
                      '(' + staffSvc.getStaffNamesInListForRole(staff, role) + ')' : ''
                    )
                  + ' is doing'`,
            rootMetricId:'aae40633d0f646ce86840bf21bfcb3a4',
            allowSkipIfNoSelectionsInMetricSubject: true
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
        errors.push((new Error(Utils.format("Survey has null campaign_id. Survey: {0}", Utils.stringify(survey)))));
      }
      let ids: Set<string> = new Set<string>();
      survey.workflow.forEach((value: WorkflowElement)=> {
        if (ids.has(value.id)) {
          errors.push(ErrorType.EntityValidationError("Duplicate campaign_id found; a dup elements is: {0} in survey campaign_id {1}",
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
