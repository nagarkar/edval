import {Metric} from "./schema";
import {Config} from "../../shared/config";
import {Injectable} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";

@Injectable()
export class MockMetricService extends AbstractMockService<Metric> {

  private static metricMap: Map<string, Metric> = MockMetricService.mockMap();

  constructor(utils: Utils,
              accessProvider: AccessTokenService) {

    super(utils, accessProvider);
  }

  reset() {
    MockMetricService.metricMap = MockMetricService.mockMap();
  }

  setId(member: Metric, id: string): string {
    return member.metricId = id;
  }

  getId(member: Metric) {
    return member.metricId;
  }

  public mockData(): Map<string, Metric> {
    return MockMetricService.metricMap;
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
        conversationSetup: "'Your overall rating for ' + account.properties.accountName + ''",
        question: "'Would you recommend ' + account.properties.accountName + ' to your friends and family?'",
        metricName: "",
        metricDescription: "Organization Level Metric. This metric is alrways present by default and cannot be deleted",
        definition: {
          npsType: {
            range: 11
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
        question: `staff ? 'How would you rate ' + staff.displayName + ' as an Orthodontic Assistant?'
          : 'How would you rate the Orthodontic Assistants at ' + account.properties.accountName + '?'`,
        metricName: "NPS Metric for Role Orthodontic Assistant",
        definition: {
          npsType: {
            range: 11
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
        question: `staff ? 'Is ' + staff.displayName + ' friendly and courteous?'
          : 'Are the Orthodontic Assistants friendly and courteous?'`,
        metricName: 'FriendlycourteousMD',
        positiveImpact: `staff ? staff.displayName + ' is friendly. ' + staff.personalPronoun() + ' treats me with the utmost respect'
            : 'The Orthodontic Assistants are friendly. They treat me with the utmost respect'`,
        improvement: "(staff ? staff.displayName : 'The Orthodontic Assistants') + ' could be more friendly and courteous'",
        definition: {
          npsType: {
            range: 11
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
        metricName: 'Doctor Skill',
        question: `staff ? 'Do you feel ' + staff.displayName + ' is skillful in performing tasks?' 
          : 'Are the Orthodontic Assistants skillful in performing tasks?'`,
        positiveImpact: "(staff ? staff.displayName + ' is' : 'The Orthodontic Assistants are') + ' skillful in performing tasks'",
        improvement: `staff ? staff.displayName + ' should improve ' + staff.posessivePronoun() + ' skills' 
          : 'The Orthodontic Assistants should improve their skills'`,
        definition: {
          npsType: {
            range: 11
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
        metricName: 'Treatment progress',
        question: `(staff ? 'Does ' + staff.displayName : 'Do the Orthodontic Assistants ') + ' keep you well-informed about progress & answer your questions?'`,
        positiveImpact: `staff ? staff.displayName + ' keeps me informed of treatment progress & answers my questions' 
          : "The Orthodontic Assistants answer my questions and get the doctor involved if they can't"`,
        improvement: "(staff ? staff.displayName : 'The Orthodontic Assistants') + ' could do a better job addressing my questions and concerns'",
        definition: {
          npsType: {
            range: 11
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
        metricName: "Genuine Interest",
        question: `staff ? 'Does ' + staff.displayName + 'show genuine interest your well being?'
          : 'Do the Orthodontic Assistants show genuine interest in you?'`,
        positiveImpact: `staff ? staff.displayName + ' shows genuine interest in ' + staff.possessivePronoun(true) + ' patients' 
          : 'The Orthodontic Assistants show genuine interest in patients'`,
        improvement: `staff ? staff.displayName + ' should try to show genuine interest in ' + staff.possessivePronoun(true) + ' patients'
          : 'The Orthodontic Assistants should try to show genuine interest in their patients'`,
        definition: {
          npsType: {
            range: 11
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '62861045b4984805ae213df729dad97b',
      parentMetricId: null,
      entityStatus: "ACTIVE",
      subject: "role:MD",
      properties: {
        question: `'Would you recommend ' 
          + (staff ? staff.displayName : ('the doctors at ' + account.properties.accountName)) 
          + ' to your friends and family?'`,
        metricName: "NPS Metric for Role MD",
        definition: {
          npsType: {
            range: 11
          }
        }
      }
    }, {
      // MD Drill Downs
      customerId: Config.CUSTOMERID,
      metricId: '2861045b4984805ae23df729dad97b',
      parentMetricId: '62861045b4984805ae213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:MD",
      properties: {
        question: 'Was your doctor friendly and courteous?',
        metricName: 'FriendlycourteousMD',
        positiveImpact: "The doctor is friendly and treats me with the utmost courtesy and respect",
        improvement: "Be more friendly and courteous",
        definition: {
          npsType: {
            range: 11
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '861045b4984805ae213df729dad97b',
      parentMetricId: '62861045b4984805ae213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:MD",
      properties: {
        metricName: 'Doctor Skill',
        question: "'Do you feel the doctor(s) at ' + account.properties.accountName + ' are skillful in providing treatment?'",
        positiveImpact: "The doctor is skilled in providing orthodontic treatment",
        improvement: "Please provide better quality treatment and focus on results",
        definition: {
          npsType: {
            range: 11
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '1045b4984805ae213df729dad97b',
      parentMetricId: '62861045b4984805ae213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:MD",
      properties: {
        metricName: 'Treatment progress',
        question: 'Are you kept well-informed about the progress of your treatment & are your questions answered?',
        positiveImpact: "The doctor keeps me informed of treatment progress & answers my questions",
        improvement: "Do a better job explaining the treatment and the plan going forward",
        definition: {
          npsType: {
            range: 11
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '045b4984805ae213df729dad97b',
      parentMetricId: '62861045b4984805ae213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:MD",
      properties: {
        metricName: "'Did ' + staff.displayName + ' address your concerns and questions?'",
        question: 'Does the doctor show genuine interest in patients?',
        positiveImpact: "The doctor shows genuine interest in patients",
        improvement: "The doctor could show more interest in patients",
        definition: {
          npsType: {
            range: 11
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
        metricName: 'How do you rate the office and support staff?',
        question: 'How would you rate the front-desk and other support staff?',
        definition: {
          npsType: {
            range: 11
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
        metricName: 'FinancialCoordination',
        question: 'Did the Financial Coordinator present financial information clearly & concisely',
        positiveImpact: 'The Financial Coordinator presented financial information clearly & concisely',
        improvement: 'The front office staff needs to be more professional and helpful!',
        definition: {
          npsType: {
            range: 11
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
        metricName: 'Was it easy and convenient to book an appointment?',
        question: 'Do you usually get an appointment at a time and location convenient to you?',
        positiveImpact: "It's always easy to book an appointment!",
        improvement: "Please make it easier to get convenient appointments",
        definition: {
          npsType: {
            range: 11
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
        metricName: 'Once you arrived, did you see your doctor on time?',
        question: 'Do you usually wait less than 5 minutes after you arrive for your appointment?',
        positiveImpact: 'My wait time is always less than 5 minutes after I arrive',
        improvement: 'I had to wait too long in the waiting area. Please get organized!',
        definition: {
          npsType: {
            range: 11
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
        metricName: 'cleanliness',
        question: 'Was the reception area comfortable & clean?',
        positiveImpact: 'The reception area is comfortable & clean',
        improvement: 'Please keep the reception area comfortable & clean!',
        definition: {
          npsType: {
            range: 11
          }
        }
      }
    }
    ];
  }
}
