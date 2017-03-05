/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Account} from "./schema";
import {TestData, ServiceTest} from "../../shared/test/service.test";
import {MockAccountService} from "./mock";
import {Config} from "../../shared/config";
import {LiveAccountService} from "./live";

let __rand = Math.random();
let testData: TestData<Account> = {
  noSupportForApiList: true,
  existingEntityIds: [Config.CUSTOMERID],
  updateConfig: {
    update: ((acc: Account)=> {
      acc.properties.verticalId = "modifiedVerticalId:" + __rand;
      acc.properties.configuration = {
        STANDARD_ROLES: "Orthodontic Assistant,DDS,FrontOffice",
        SWEEPSTAKES_INTERVAL:1,
        SWEEPSTAKES_SHOW_WHEEL: false,
        SWEEPSTAKES_AWARD_AMOUNT: 5,
        SWEEPSTAKES_COST_PER_USE: 1,
        SHOW_JOKES_ON_THANK_YOU_PAGE: true
      };
      acc.properties.address = {
        street1: 'street 1',
        street2: 'street 2'
      };
      return true;
    }),
    verify: ((acc: Account)=> {
      expect(acc.properties.verticalId).toEqual("modifiedVerticalId:" + __rand);
      expect(acc.properties.address.street1).toEqual('street 1');
      expect(acc.properties.configuration).toEqual({
        STANDARD_ROLES: "Orthodontic Assistant,DDS,FrontOffice",
        SWEEPSTAKES_INTERVAL:1,
        SWEEPSTAKES_SHOW_WHEEL: false,
        SWEEPSTAKES_AWARD_AMOUNT: 5,
        SWEEPSTAKES_COST_PER_USE: 1,
        SHOW_JOKES_ON_THANK_YOU_PAGE: true
      });
    }),
  }
}

describe('Mock Account Tests', () => {
  new ServiceTest<Account>(MockAccountService, testData);
});

describe('Live Account Tests', () => {
  new ServiceTest<Account>(LiveAccountService, testData);
});
