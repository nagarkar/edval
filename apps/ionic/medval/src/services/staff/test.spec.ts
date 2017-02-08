/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {MockStaffService} from "./mock";
import {Staff} from "./schema";
import {LiveStaffService} from "./live";
import {ServiceTest, TestData} from "../../shared/test/service.test";

let data: Array<Staff> = Array.from(MockStaffService.mockMap().values());
let testData: TestData<Staff> = {
  defaultNumberOfEntities: data.length,
  create: data,
  updateConfig: {
    update: ((staff: Staff, index: number) => {
      if (index > 0) return false;
      staff.properties.firstName = "modified";
      return true;
    }),
    verify: ((staff: Staff, index: number)=> {
      if (index > 0) return;
      expect(staff.properties.firstName).toEqual("modified");
    })
  }
}

describe('Mock Staff Tests', () => {
  new ServiceTest<Staff>(MockStaffService, testData);
});

describe('Live Staff Tests', () => {
  new ServiceTest<Staff>(LiveStaffService, testData);
});
