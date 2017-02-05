import {ServiceTest, TestData} from "../../shared/test/service.test";
import {Config} from "../../shared/config";
import {Campaign} from "./schema";
import {LiveCampaignService} from "./live";
import {MockCampaignService} from "./mock";


let __rand = Math.random();
let metricSubjects: string[] = [];
let testData: TestData<Campaign> = {
  noSupportForApiList: true,
  existingEntityIds: [Config.CUSTOMERID],
  updateConfig: {
    update: ((acc: Campaign)=> {
      acc.properties.name = "modifiedName:" + __rand;
      metricSubjects.push(acc.statistics.metrics[0].metricSubject);
      acc.statistics.metrics[0].metricSubject = "modifiedSubject" + __rand;
      return true;
    }),
    verify: ((acc: Campaign)=> {
      expect(acc.properties.name).toEqual("modifiedName:" + __rand);
      expect(acc.statistics.metrics[0].metricSubject).toEqual(metricSubjects.shift());
    }),
  }
}

describe('Mock Campaign Tests', () => {
  new ServiceTest<Campaign>(MockCampaignService, testData);
});

describe('Live Campaign Tests', () => {
  new ServiceTest<Campaign>(LiveCampaignService, testData);
});
