import {Account} from "./schema";
import {LiveAccountService} from "./live";
import {ServiceTest, TestData} from "../../shared/test/service.test";
import {MockAccountService} from "./mock";
import {Config} from "../../shared/config";

let data: Array<Account> = Array.from(MockAccountService.mockMap().values());
let testData: TestData<Account> = {
  updateConfig: {
    update: ((acc: Account)=> {
      if (acc.customerId == Config.CUSTOMERID) {
        acc.properties.verticalId = "modifiedVerticalId";
        acc.properties.configuration = {'standardRoles':'MD,Orthodontic Assistant'};
        acc.properties.address = {
          street1: 'street 1',
          street2: 'street 2'
        };
        return true;
      }
      return false;
    }),
    verify: ((acc: Account)=> {
      expect(acc.properties.verticalId).toEqual("modifiedVerticalId");
      expect(acc.properties.address.street1).toEqual('street 1');
      expect(acc.properties.configuration).toEqual({
        'standardRoles': 'MD,Orthodontic Assistant'
      });
    }),
  }
}

describe('Mock Staff Tests', () => {
  new ServiceTest<Account>(MockAccountService, testData);
});

describe('Live Staff Tests', () => {
  new ServiceTest<Account>(LiveAccountService, testData);
});
