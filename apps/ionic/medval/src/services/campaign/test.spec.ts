/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
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
      return true;
    }),
    verify: ((acc: Campaign)=> {
      expect(acc.properties.name).toEqual("modifiedName:" + __rand);
    }),
  }
}

describe('Mock Campaign Tests', () => {
  new ServiceTest<Campaign>(MockCampaignService, testData);
});

describe('Live Campaign Tests', () => {
  new ServiceTest<Campaign>(LiveCampaignService, testData);
});
