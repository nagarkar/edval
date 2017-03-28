/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Metric} from "./schema";
import {Config} from "../../shared/config";
import {Injectable} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";

@Injectable()
export class MockMetricService extends AbstractMockService<Metric> {

  private metricMap: Map<string, Metric>;

  constructor(utils: Utils,
              accessProvider: AccessTokenService) {

    super(utils, accessProvider);
  }

  reset() {
    this.metricMap = MockMetricService.mockMap();
  }

  setId(member: Metric, id: string): string {
    return member.metricId = id;
  }

  getId(member: Metric) {
    return member.metricId;
  }

  public mockData(): Map<string, Metric> {
    return this.metricMap;
  }

  private static mockMap(): Map<string, Metric> {
    let map: Map<string, Metric> = new Map<string, Metric>();
    MockMetricService.getMetrics().forEach((untypedMetric: any) => {
      const metric: Metric = Object.assign<Metric, any>(new Metric(), untypedMetric);
      map.set(metric.metricId, metric);
    });
    return map;
  }

  // MD Questions
  // NPS Parent
  static getMetrics(): any[] {
    return [{
      customerId: Config.CUSTOMERID,
      metricId: 'root',
      parentMetricId: null,
      entityStatus: "ACTIVE",
      subject: "org",
      properties: {
        conversationSetup: "'Your overall rating for ' + account.properties.customerName + ''",
        question: "'Would you recommend ' + account.properties.customerName + ' to your friends and family?'",
        metricName: "Overall Favorability",
        metricDescription: "Organization Level Metric. This metric is always present by default and cannot be deleted",
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '62861045b4984805213df729dad97b',
      parentMetricId: null,
      entityStatus: "ACTIVE",
      subject: "role:Orthodontic Assistant",
      properties: {
        question: `onlyStaff ? "How would you rate " + onlyStaff.displayName + " as an Orthodontic Assistant?"
          : "How would you rate the Doctor's Assistants at " + account.properties.customerName + "?"`,
        metricName: "Favorability - Assistants",
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      // Ortho Asst. Drill Downs
      customerId: Config.CUSTOMERID,
      metricId: '2861045b4985ae23df729dad97b',
      parentMetricId: '62861045b4984805213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:Orthodontic Assistant",
      properties: {
        question: `onlyStaff ? "Is " + onlyStaff.displayName + " friendly and courteous?"
          : "Are the Doctor's Assistants friendly and courteous?"`,
        metricName: 'Friendly and Courteous',
        positiveImpact: `onlyStaff ? onlyStaff.displayName + " is friendly. " + onlyStaff.personalPronoun() + " treats me with the utmost respect"
            : "The Doctor's Assistants are friendly and respectful"`,
        improvement: `(staff && staff.length == 1 ? staff[0].displayName : "The Doctor's Assistants") + " could be more friendly and courteous"`,
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '861045b4984ae213df729dad97b',
      parentMetricId: '62861045b4984805213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:Orthodontic Assistant",
      properties: {
        metricName: 'Medical Skills - Assistants',
        question: `onlyStaff ? "Do you feel " + onlyStaff.displayName + " is skillful in performing tasks?" 
          : "Are the Doctor's Assistants skillful in performing tasks?"`,
        positiveImpact: `(onlyStaff ? onlyStaff.displayName + ' is' : "The Doctor's Assistants are") + ' skillful in performing tasks'`,
        improvement: `onlyStaff ? onlyStaff.displayName + ' should improve ' + onlyStaff.posessivePronoun() + ' skills' 
          : "The Doctor's assistants should improve their medical skills"`,
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '1045b4984ae213df729dad97b',
      parentMetricId: '62861045b4984805213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:Orthodontic Assistant",
      properties: {
        metricName: 'Responsiveness',
        question: `(onlyStaff ? 'Does ' + onlyStaff.displayName : "Do the Doctor's assistants ") + ' keep you well-informed about progress & answer your questions?'`,
        positiveImpact: `onlyStaff ? onlyStaff.displayName + ' keeps me informed of treatment progress & answers my questions' 
          : "The Doctors Assistants answer my questions and keep me informed of the treatment progress"`,
        improvement: `(onlyStaff ? onlyStaff.displayName : "The Doctor's Assistants") + ' could do a better job addressing my concerns'`,
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '045b498ae213df729dad97b',
      parentMetricId: '62861045b4984805213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:Orthodontic Assistant",
      properties: {
        metricName: "Interest in Outcomes - Assistants",
        question: `onlyStaff ? 'Does ' + onlyStaff.displayName + ' show genuine interest your well being?'
          : "Do the Doctor's Assistants show genuine interest in you?"`,
        positiveImpact: `onlyStaff ? onlyStaff.displayName + ' shows genuine interest in ' + onlyStaff.possessivePronoun(true) + ' patients' 
          : "The Doctor's Assistants show genuine interest in patients"`,
        improvement: `onlyStaff ? onlyStaff.displayName + ' should try to show genuine interest in ' + onlyStaff.possessivePronoun(true) + ' patients'
          : "The Doctor's Assistants should show genuine interest in patients"`,
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '62861045b4984805ae213df729dad97b',
      parentMetricId: null,
      entityStatus: "ACTIVE",
      subject: "role:DDS",
      properties: {
        question: `'Would you recommend ' 
          + (onlyStaff ? onlyStaff.displayName : ('the doctors at ' + account.properties.customerName)) 
          + ' to your friends and family?'`,
        metricName: "Favorability - Doctors",
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      // MD Drill Downs
      customerId: Config.CUSTOMERID,
      metricId: '2861045b4984805ae23df729dad97b',
      parentMetricId: '62861045b4984805ae213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:DDS",
      properties: {
        question: 'Was your doctor friendly and courteous?',
        metricName: 'Friendly and Courteous Doctors',
        //positiveImpact: ` ? "": ""`,
        positiveImpact: `onlyStaff ? onlyStaff.displayName  + " is friendly and treats me with the utmost courtesy and respect"
          : "The doctors are friendly and treat me with the utmost courtesy and respect"`,
        improvement: "Be friendly and courteous",
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '861045b4984805ae213df729dad97b',
      parentMetricId: '62861045b4984805ae213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:DDS",
      properties: {
        metricName: 'Medical Skill - Doctors',
        question: "'Do you feel the doctor(s) at ' + account.properties.customerName + ' are skillful in providing treatment?'",
        positiveImpact: `onlyStaff ? onlyStaff.displayName  + " is skilled in providing treatment"
          : "The doctors are skilled in providing treatment"`,
        improvement: "The doctor could be more skillful when treating patients",
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '1045b4984805ae213df729dad97b',
      parentMetricId: '62861045b4984805ae213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:DDS",
      properties: {
        metricName: 'Responsiveness - Doctors',
        question: 'Are you kept well-informed about the progress of your treatment & are your questions answered?',
        positiveImpact: `onlyStaff ? onlyStaff.displayName  + " keeps me informed of treatment progress & answers my questions"
          : "The doctors keep me informed of treatment progress & answer my questions"`,
        improvement: "Do a better job explaining the treatment-plan going forward",
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '045b4984805ae213df729dad97b',
      parentMetricId: '62861045b4984805ae213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:DDS",
      properties: {
        metricName: 'Interest in Outcomes - Doctors',
        question: `onlyStaff ? 'Did ' + onlyStaff.displayName + ' address your concerns and questions?'
            'Did the doctors at Orthodontic Excellence address your concerns and questions?'`,
        positiveImpact: `onlyStaff ? onlyStaff.displayName  + " shows genuine interest in patients"
          : "The doctors show genuine interest in patients"`,
        improvement: "The doctor could show more interest in patients",
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: 'aae40633d0f646ce86840bf21bfcb3a4',
      parentMetricId: null,
      entityStatus: "ACTIVE",
      subject: "role:FrontOffice",
      properties: {
        metricName: 'Favorability - Frontoffice',
        question: `onlyStaff ? "How do you rate " +  onlyStaff.displayName + " in the front-office?" 
           : "How would you rate the support staff in the front-office?"`,
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '95a8659497274ffe9f8fb14fa45b21e5',
      parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
      entityStatus: "ACTIVE",
      subject: "role:FrontOffice",
      properties: {
        metricName: 'Financial Coordination',
        question: 'Did the Financial Coordinator present information clearly',
        positiveImpact: 'Information about costs and payment plans is presented clearly',
        improvement: 'Information about payment plans and costs could be presented more clearly',
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '6e0f99cdd7a34a058ff2fb22fbe51738',
      parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
      entityStatus: "ACTIVE",
      subject: "role:FrontOffice",
      properties: {
        metricName: 'Easy Appointments',
        question: 'Do you usually get an appointment at a time and location convenient to you?',
        positiveImpact: `It's always easy to book an appointment`,
        improvement: "Make it easier to get convenient appointments",
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '0f99cdd7a34a058ff2fb22fbe51738',
      parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
      entityStatus: "ACTIVE",
      subject: "role:FrontOffice",
      properties: {
        metricName: 'Low Waiting Time',
        question: 'Do you usually wait less than 5 minutes after you arrive for your appointment?',
        positiveImpact: 'My wait time is always less than 5 minutes after I arrive',
        improvement: 'I had to wait too long in the waiting area',
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '34182735427d4f2eba99eb0acb66078f',
      parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
      entityStatus: "ACTIVE",
      subject: "role:FrontOffice",
      properties: {
        metricName: 'Cleanliness',
        question: 'Was the reception area comfortable & clean?',
        positiveImpact: 'The reception area is always comfortable & the clinic is clean and tidy',
        improvement: 'Sometimes, the reception area is not comfortable and/or clean',
        definition: {
          npsType: {
            range: 5
          }
        }
      }
    }
    ];
  }
}
