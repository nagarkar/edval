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
        return true;
      }
      return false;
    }),
    verify: ((acc: Account)=> {
      expect(acc.properties.verticalId).toEqual("modifiedVerticalId");
    }),
  }
}

describe('Mock Staff Tests', () => {
  new ServiceTest<Account>(MockAccountService, testData);
});

describe('Live Staff Tests', () => {
  new ServiceTest<Account>(LiveAccountService, testData);
});
