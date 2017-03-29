/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
///<reference path="../../shared/service/abstract.mock.service.ts"/>
import {Injectable} from "@angular/core";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";
import {Utils} from "../../shared/stuff/utils";
import {Aggregate, DailyDataList, DailyData} from "./schema";
import {Config} from "../../shared/config";


@Injectable()
export class MockDailyDataService extends AbstractMockService<DailyDataList> {

  setId(member: DailyDataList, id: string): string {
    Utils.unsupportedOperationError('setId', this);
    return '';
  }

  private static data: Map<string, DailyDataList>;

  constructor() {

    super();
  }

  reset(): Promise<any>  {
    MockDailyDataService.data = this.mockData();
    return Promise.resolve();
  }


  getId(member: DailyDataList) {
    return member.id;
  }

  public mockData() : Map<string, DailyDataList> {
    if (!MockDailyDataService.data || !MockDailyDataService.data.size) {
      MockDailyDataService.data = MockDailyDataService.mockMap();
    }
    return MockDailyDataService.data;
  }

  static mockMap() : Map<string, DailyDataList> {
    let map : Map<string, DailyDataList> = new Map<string, DailyDataList>();
    map.set("role:DDS", Object.assign(new DailyDataList(), {subject: "role:DDS", startDate: 1483075968000, endDate: 1485840768000, list: [Object.assign(new DailyData(), {
        customerId: Config.CUSTOMERID,
        subject: 'role:DDS',
        year: 2017,
        month: 1,
        day: 1,
        metricId: 'root',
        parentMetricId: null,
        aggregate: Object.assign(new Aggregate(), {count: 10, sum: 40})
      }),Object.assign(new DailyData(), {
        customerId: Config.CUSTOMERID,
        subject: 'role:DDS',
        year: 2017,
        month: 1,
        day: 3,
        metricId: 'root',
        parentMetricId: null,
        aggregate: Object.assign(new Aggregate(), {count: 9, sum: 41})
      }),Object.assign(new DailyData(), {
        customerId: Config.CUSTOMERID,
        subject: 'role:DDS',
        year: 2017,
        month: 1,
        day: 10,
        metricId: 'root',
        parentMetricId: null,
        aggregate: Object.assign(new Aggregate(), {count: 10, sum: 35})
      }),Object.assign(new DailyData(), {
        customerId: Config.CUSTOMERID,
        subject: 'role:DDS',
        year: 2017,
        month: 1,
        day: 29,
        metricId: 'root',
        parentMetricId: null,
        aggregate: Object.assign(new Aggregate(), {count: 8, sum: 30})
      }),Object.assign(new DailyData(), {
        customerId: Config.CUSTOMERID,
        subject: 'role:DDS',
        year: 2017,
        month: 1,
        day: 4,
        metricId: 'child',
        parentMetricId: 'root',
        aggregate: Object.assign(new Aggregate(), {count: 10, sum: 35})
      }),Object.assign(new DailyData(), {
        customerId: Config.CUSTOMERID,
        subject: 'role:DDS',
        year: 2017,
        month: 1,
        day: 13,
        metricId: 'child',
        parentMetricId: 'root',
        aggregate: Object.assign(new Aggregate(), {count: 10, sum: 35})
      }),Object.assign(new DailyData(), {
        customerId: Config.CUSTOMERID,
        subject: 'role:DDS',
        year: 2017,
        month: 1,
        day: 19,
        metricId: 'child',
        parentMetricId: 'root',
        aggregate: Object.assign(new Aggregate(), {count: 10, sum: 35})
      }),Object.assign(new DailyData(), {
        customerId: Config.CUSTOMERID,
        subject: 'role:DDS',
        year: 2017,
        month: 1,
        day: 30,
        metricId: 'child',
        parentMetricId: 'root',
        aggregate: Object.assign(new Aggregate(), {count: 10, sum: 35})
    })]}));
    map.set("org", Object.assign(new DailyDataList(), {subject: "org", startDate: 1483075968000, endDate: 1485840768000, list: [Object.assign(new DailyData(), {
      customerId: Config.CUSTOMERID,
      subject: 'org',
      year: 2017,
      month: 1,
      day: 1,
      metricId: 'root',
      parentMetricId: null,
      aggregate: Object.assign(new Aggregate(), {count: 10, sum: 40})
    }),Object.assign(new DailyData(), {
      customerId: Config.CUSTOMERID,
      subject: 'org',
      year: 2017,
      month: 1,
      day: 3,
      metricId: 'root',
      parentMetricId: null,
      aggregate: Object.assign(new Aggregate(), {count: 9, sum: 41})
    }),Object.assign(new DailyData(), {
      customerId: Config.CUSTOMERID,
      subject: 'org',
      year: 2017,
      month: 1,
      day: 10,
      metricId: 'root',
      parentMetricId: null,
      aggregate: Object.assign(new Aggregate(), {count: 10, sum: 35})
    })]}));
    return map;
  }
}
