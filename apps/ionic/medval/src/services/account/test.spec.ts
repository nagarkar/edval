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
      acc.properties.configuration = {'standardRoles':'MD,Orthodontic Assistant'};
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
        'standardRoles': 'DDS,Orthodontic Assistant'
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
