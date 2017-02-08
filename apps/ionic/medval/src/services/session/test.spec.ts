/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {ServiceTest, TestData} from "../../shared/test/service.test";
import {Config} from "../../shared/config";
import {Session} from "./schema";
import {SessionService} from "./delegator";
import {inject} from "@angular/core/testing";
import {MetricValue} from "../metric/schema";
import {serialize, deserialize, deserializeArray} from "class-transformer";
import {LiveSessionService} from "./live";
import {MockSessionService} from "./mock";

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

let testData: TestData<Session> = {
  defaultNumberOfEntities: 0, // We create one session before each test and cleanup is true
  cleanup: true,
  create: [new Session()],
  updateConfig: {
    update: ((acc: Session)=> {
      if (acc.customerId == Config.CUSTOMERID) {
        let props = acc.properties;
        props.aggregationProcessed = true;
        props.surveyId = "default";
        props.selectedStaffUserNames.push('user1');
        props.selectedRoles.push('role1');
        props.staffMetricValues.set('staff:sub', [new MetricValue('metricid', '10')]);
        props.roleMetricValues.set('role:sub', [new MetricValue('metricid', '10')])
        props.orgMetricValues.set('org:sub', [new MetricValue('metricid', '10')])
        props.endTime = Date.now();
        props.navigatedLocations.push('somelocation');
        props.reviewData = {email: 'me@my.com', phone:'203000200', message:'somereview data'};
        props.complaintData = {email: 'me@my.com', phone:'203000200', message:'somereview data'};
        return true;
      }
      return false;
    }),
    verify: ((acc: Session)=> {
      let props = acc.properties;
      expect(props.aggregationProcessed).toEqual(true);
      expect(props.surveyId).toEqual('default');
      expect(props.selectedStaffUserNames).toEqual(['user1']);
      expect(props.selectedRoles).toEqual(['role1']);
      expect(props.staffMetricValues.size).toEqual(1);
      expect(props.roleMetricValues.size).toEqual(1);
      expect(props.orgMetricValues.size).toEqual(1);
      expect(props.endTime).toBeDefined();
      expect(props.navigatedLocations).toEqual(['somelocation']);
      expect(props.reviewData).toEqual({email: 'me@my.com', phone:'203000200', message:'somereview data', preferredReviewSite: null})
      expect(props.complaintData).toEqual({email: 'me@my.com', phone:'203000200', message:'somereview data', preferredReviewSite: null})
    }),
  }
}

describe('serialization', ()=> {
  it('serialization checks', (done)=> {
    let session: Session = new Session();
    let props = session.properties;
    props.aggregationProcessed = true;
    props.surveyId = "default";
    props.selectedStaffUserNames.push('user1');
    props.selectedRoles.push('role1');
    props.staffMetricValues.set('staff:sub', [new MetricValue('metricid', '10')]);
    props.roleMetricValues.set('role:sub', [new MetricValue('metricid', '10')])
    props.orgMetricValues.set('org:sub', [new MetricValue('metricid', '10')])
    props.endTime = Date.now();
    props.navigatedLocations.push('somelocation');
    props.reviewData = {email: 'me@my.com', phone: '203000200', message: 'somereview data'};
    props.complaintData = {email: 'me@my.com', phone: '203000200', message: 'somereview data'};

    let json: string = serialize(session);
    let roundTripSession = deserialize<Session>(Session, json);
    expect(roundTripSession).toEqual(session);

    json = serialize([session]);
    let roundTripSessionArr = deserializeArray<Session>(Session, json);
    expect(roundTripSessionArr).toEqual([session]);

    done();
  });
})

describe ('Default State checks', ()=> {
  new ServiceTest<Session>();
  it('state checks', (done)=>{
    inject([SessionService], (svc: SessionService) => {
      /**
       Set mock mode so actual sessions are not created in the backend, violoating the defaultNumberOfEntities=0
       setting.
      */
      svc.setMockMode(true);
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
      svc.clearCache();
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
