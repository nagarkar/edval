import {Account} from "./schema";
import {LiveAccountService} from "./live";
import {ServiceTest, TestData} from "../../shared/test/service.test";
import {MockAccountService} from "./mock";

let data: Array<Account> = Array.from(MockAccountService.mockMap().values());
let testData: TestData<Account> = {
  create: data,
  updateConfig: {
    update: ((acc: Account)=> {
      acc.properties.verticalId = "modifiedVerticalId";
      return true;
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
