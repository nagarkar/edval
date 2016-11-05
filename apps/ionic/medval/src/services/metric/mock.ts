import {Metric, NPSType, TextType} from './schema';
import {Config} from "../../shared/aws/config";

export const METRICS: Metric[] = [
  // MD Questions
  // NPS Parent
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '62861045b4984805ae213df729dad97b',
    parentMetricId: null,
    entityStatus: "ACTIVE",
    subject   : "role:MD",
    properties: {
      metricName: 'Would you recommend {0} to friends and family?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  // MD DrillDowns
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '2861045b4984805ae23df729dad97b',
    parentMetricId: '62861045b4984805ae213df729dad97b',
    entityStatus: "ACTIVE",
    subject   : "role:MD",
    properties: {
      metricName: 'Was your doctor friendly and courteous?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '861045b4984805ae213df729dad97b',
    parentMetricId: '62861045b4984805ae213df729dad97b',
    entityStatus: "ACTIVE",
    subject   : "role:MD",
    properties: {
      metricName: 'Were you satisfied with the outcome of your treatment?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '1045b4984805ae213df729dad97b',
    parentMetricId: '62861045b4984805ae213df729dad97b',
    entityStatus: "ACTIVE",
    subject   : "role:MD",
    properties: {
      metricName: 'Did you have a clear understanding of the plan going forward?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '045b4984805ae213df729dad97b',
    parentMetricId: '62861045b4984805ae213df729dad97b',
    entityStatus: "ACTIVE",
    subject   : "role:MD",
    properties: {
      metricName: 'Did Dr. El-Ghazzawi address your concerns and questions?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '5b4984805ae213df729dad97b',
    parentMetricId: '62861045b4984805ae213df729dad97b',
    entityStatus: "ACTIVE",
    subject   : "role:MD",
    properties: {
      metricName: 'Do you feel the treatment plan was properly explained to you?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  // Office Staff QUestions
  // Main NPS question
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: 'aae40633d0f646ce86840bf21bfcb3a4',
    parentMetricId: null,
    entityStatus: "ACTIVE",
    subject   : "role:PA",
    properties: {
      metricName: 'How do you rate the office and support staff?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  // Office staff Drilldown Questions
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '95a8659497274ffe9f8fb14fa45b21e5',
    parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
    entityStatus: "ACTIVE",
    subject   : "role:PA",
    properties: {
      metricName: 'Was the office staff professional and helpful?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '6e0f99cdd7a34a058ff2fb22fbe51738',
    parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
    entityStatus: "ACTIVE",
    subject   : "role:PA",
    properties: {
      metricName: 'Was it easy and convenient to book an appointment?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: 'e0f99cdd7a34a058ff2fb22fbe51738',
    parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
    entityStatus: "ACTIVE",
    subject   : "role:PA",
    properties: {
      metricName: 'Did the office staff respect your privacy?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '0f99cdd7a34a058ff2fb22fbe51738',
    parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
    entityStatus: "ACTIVE",
    subject   : "role:PA",
    properties: {
      metricName: 'Once you arrived, did you see your doctor on time?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '34182735427d4f2eba99eb0acb66078f',
    parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
    entityStatus: "ACTIVE",
    subject   : "role:PA",
    properties: {
      metricName: 'Was the office staff helpful with insurance and billing questions?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  // Control Questions
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '4182735427d4f2eba99eb0acb66078f',
    parentMetricId: null,
    entityStatus: "ACTIVE",
    subject   : "control",
    properties: {
      metricName: 'Did you mind providing this quick, anonymous review?',
      definition: {
        npsType: {
          range: 11
        }
      }
    }
  }),
  // Text Question
  Object.assign<Metric, any>(new Metric(), {
    customerId: Config.CUSTOMERID,
    metricId: '4182735427d4f2eba99eb0acb66078f',
    parentMetricId: null,
    entityStatus: "ACTIVE",
    subject   : "freeform",
    properties: {
      metricName: 'Would you care to add anything else?',
      definition: {
        textType: {}
      }
    }
  }),
];
