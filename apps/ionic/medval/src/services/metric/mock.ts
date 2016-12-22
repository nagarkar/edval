import {Metric} from './schema';
import {Config} from "../../shared/aws/config";

import {Injectable} from '@angular/core';
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";

@Injectable()
export class MockMetricService extends AbstractMockService<Metric> {

  private static metricMap: Map<string, Metric> = MockMetricService.mockMap();

  constructor(utils: Utils,
              accessProvider: AccessTokenService) {

    super(utils, accessProvider);
    Utils.log("created staff account)");
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
        conversationSetup: "Lets get the most important question out of the way!",
        question: "Would you recommend Orthodontic Excellence to your friends and family?",
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
        question: "How do you rate ${item.get('staff').displayName} as an Orthodontic Assistant?",
        metricName: "NPS Metric for Role Orthodontic Assistant",
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
        question: "Would you recommend ${item.get('staff').displayName} to friends and family?",
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
        positiveImpact: "Dr. Megha is friendly and courteous.",
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
        metricName: 'Were you satisfied with the outcome of your treatment?',
        question: 'Were you satisfied with the outcome of your treatment?',
        positiveImpact: "I always get great treatment and great results here.",
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
        metricName: 'Did you have a clear understanding of the plan going forward?',
        question: 'Did you have a clear understanding of the plan going forward?',
        positiveImpact: "I always know the treament I'm getting, why I'm getting it and the plan going forward",
        improvement: "Do a better job explaining the treaments and the plan going forward",
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
        metricName: 'Did Dr. Megha address your concerns and questions?',
        question: 'Did Dr. Megha address your concerns and questions?',
        positiveImpact: "Dr. Megha always addresses my concerns and questions!",
        improvement: "Try to do a better job listening to patients and addressing their concerns",
        definition: {
          npsType: {
            range: 11
          }
        }
      }
    }, {
      customerId: Config.CUSTOMERID,
      metricId: '5b4984805ae213df729dad97b',
      parentMetricId: '62861045b4984805ae213df729dad97b',
      entityStatus: "ACTIVE",
      subject: "role:MD",
      properties: {
        metricName: 'Do you feel the treatment plan was properly explained to you?',
        question: 'Do you feel the treatment plan was properly explained to you?',
        positiveImpact: 'The doctor & staff at OE did a great job explaining the treatment plan',
        improvement: 'Try to do a better job explaining the treatment plan',
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
      subject: "role:PA",
      properties: {
        metricName: 'How do you rate the office and support staff?',
        question: 'How do you rate the office and support staff?',
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
      subject: "role:PA",
      properties: {
        metricName: 'Was the office staff professional and helpful?',
        question: 'Was the office staff professional and helpful?',
        positiveImpact: 'The office and support staff are professional and helpful!',
        improvement: 'The front office staff need to be more professional and helpful!',
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
      subject: "role:PA",
      properties: {
        metricName: 'Was it easy and convenient to book an appointment?',
        question: 'Was it easy and convenient to book an appointment?',
        positiveImpact: "It's always easy to book an appointment!",
        improvement: "Please make it easier to get appointments",
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
      subject: "role:PA",
      properties: {
        metricName: 'Once you arrived, did you see your doctor on time?',
        question: 'Once you arrived, did you see your doctor on time?',
        positiveImpact: 'My wait time is always less than 5 minutes',
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
      subject: "role:PA",
      properties: {
        metricName: 'Was the office staff helpful with insurance and billing questions?',
        question: 'Was the office staff helpful with insurance and billing questions?',
        positiveImpact: 'The office and support staff are always helpful with insurance and billing questions!',
        improvement: 'The office staff could be more helpful with insurance and billing questions',
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
