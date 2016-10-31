import {Metric, NPSType} from './metric.schema';
import {Config} from "../../shared/aws/config";

export const METRICS: Metric[] = [{
    customerId: Config.CUSTOMERID,
    metricId: '62861045b4984805ae213df729dad97b',
    entityStatus: "ACTIVE",
    subject   : "staff:adelg",
    properties: {
      metricName: 'What was your favorite cartoon?',
      definition: {
        type : NPSType
      }
    }
  },
  {
    customerId: Config.CUSTOMERID,
    metricId: 'aae40633d0f646ce86840bf21bfcb3a4',
    entityStatus: "ACTIVE",
    subject   : "staff:adelg",
    properties: {
      metricName: 'Do you prefer a quiet night at home or going out to a big part?',
      definition: {
        type : {

        }
      }
    }
  },
  {
    customerId: Config.CUSTOMERID,
    metricId: '95a8659497274ffe9f8fb14fa45b21e5',
    entityStatus: "ACTIVE",
    subject   : "staff:adelg",
    properties: {
      metricName: 'Do you recycle?',
      definition: {
        type : NPSType
      }
    }
  },
  {
    customerId: Config.CUSTOMERID,
    metricId: '6e0f99cdd7a34a058ff2fb22fbe51738',
    entityStatus: "ACTIVE",
    subject   : "staff:adelg",
    properties: {
      metricName: 'Are you an indoor or outdoor person?',
      definition: {
        type : NPSType
      }
    }
  },
  {
    customerId: Config.CUSTOMERID,
    metricId: '34182735427d4f2eba99eb0acb66078f',
    entityStatus: "ACTIVE",
    subject   : "staff:adelg",
    properties: {
      metricName: 'Are you a pessimist or an optimist?',
      definition: {
        type : NPSType
      }
    }
  }];
