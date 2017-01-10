import {ServiceTest, TestData} from "../../shared/test/service.test";
import {Config} from "../../shared/config";
import {Session} from "./schema";
import {MockSessionService} from "./mock";
import {LiveSessionService} from "./live";
import {SessionService} from "./delegator";
import {inject} from "@angular/core/testing";

let testData: TestData<Session> = {
  defaultNumberOfEntities: 0, // We create one session before each test.
  create: [new Session()],
  updateConfig: {
    update: ((acc: Session)=> {
      if (acc.customerId == Config.CUSTOMERID) {
        acc.properties.aggregationProcessed = true;
        return true;
      }
      return false;
    }),
    verify: ((acc: Session)=> {
      expect(acc.properties.aggregationProcessed).toEqual(true);
    }),
  },
  cleanup: true
}

let assertNoCurrentSession = (svc: SessionService)=> {expect(svc.hasCurrentSession()).toEqual(false)}
let assertCurrentSession = (svc: SessionService)=> {expect(svc.hasCurrentSession()).toEqual(true)}
let assertSessionClosed = (session: Session)=> {
  expect(session.properties.aggregationProcessed).toEqual(false);
  expect(session.properties.endTime).toBeDefined();
  expect(session.entityStatus).toEqual("ACTIVE");
  let ret = {
    withUrl: (url) =>{
      expect(session.properties.navigatedLocations.indexOf(url)).toBeGreaterThanOrEqual(0);
      return ret;
    },
    withUserName: (username)=> {
      expect(session.properties.selectedStaffUserNames.indexOf(username)).toBeGreaterThanOrEqual(0);
      return ret;
    }
  }
  return ret;
}

describe ('Default State checks', ()=> {
  new ServiceTest<Session>();
  it('state checks', (done)=>{
    inject([SessionService], (svc: SessionService) => {
      assertNoCurrentSession(svc);
      svc.newCurrentSession('default');
      assertCurrentSession(svc);
      svc.recordNavigatedLocationInCurrentSession('someurl');
      svc.getCurrentSession().setStaffUsernames(['user1', 'user2']);
      let session = svc.getCurrentSession();
      svc.closeCurrentSession();
      assertNoCurrentSession(svc);
      assertSessionClosed(session).withUrl('someurl').withUserName('user1').withUserName('user2');
      svc.newCurrentSession('default');
      session = svc.getCurrentSession();
      done();
    })();
  })
})

describe('Mock Session Tests', () => {
  new ServiceTest<Session>(MockSessionService, testData);
});

describe('Live Session Tests', () => {
  new ServiceTest<Session>(LiveSessionService, testData);
});
