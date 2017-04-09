/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {AccessTokenService} from "../aws/access.token.service";
import {inject} from "@angular/core/testing";
import {TestUtils} from "../../test";
import {RevvolveApp} from "../../app/revvolve.app";
import {ServiceInterface} from "../service/interface.service";
import {Utils} from "../stuff/utils";

export interface TestData<T> {
  defaultNumberOfEntities?: number;
  existingEntityIds?: string[],
  noSupportForApiList?: boolean;
  create?: T[];
  updateConfig?: {
    update: (entity: T, index: number)=> boolean; // Return true if
    verify?: (entity: T, index: number)=> void;
  };
  cleanup?: boolean;
}

export class ServiceTest <T> {

  static authResult = null;
  static creds = {
    username: 'uitests',
    password: '123123'
  }

  originalTimeout;
  svc: ServiceInterface<T>;
  private knownEntityList: T[];
  private entitiesCreated = false;

  constructor(private svcConstr?: Function, private testData?: TestData<T>) {

    this.setupBeforeAndAfterEach();

    if (!svcConstr) {
      return;
    }

    this.testServiceInjectable();
    this.testGetExistingEntities('Initial Get Entities');
    this.testList('initial list');
    if (testData.create && testData.create.length > 0) {
      // Always delete everything before creating.
      this.testDeleteAll();
      this.testList('after delete');
      this.testCreateAll();
      this.testList('after create');
    }
    if (testData.updateConfig) {
      this.testUpdate();
      this.testList('after update');
    }
    if (testData.cleanup) {
      this.testDeleteAll("Cleanup");
    }
  }

  beforeEach(done?: DoneFn) {
    TestUtils.beforeEachCompiler([RevvolveApp]);

    this.originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    if (ServiceTest.authResult) {
      done();
      return;
    }

    inject([AccessTokenService], (tokenSvc: AccessTokenService) => {
      tokenSvc.login(ServiceTest.creds.username, ServiceTest.creds.password)
        .then((result)=>{
          ServiceTest.authResult = result;
          if (!done) {
            return;
          }
          done();
        })
        .catch((err)=>{
          done.fail(err);
        })
    })();
  }

  afterEach(done?: DoneFn) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = this.originalTimeout;
    if (done) {
      done();
    }
  }

  private testGetExistingEntities(tag: string) {
    if (!this.testData.existingEntityIds) {
      return;
    }
    it(Utils.format('Get for service {0}, tag:{1}', this.svcConstr["name"], tag), (done)=> {
      let dataCount = this.testData.existingEntityIds.length;
      let entityList: T[] = [];
      setTimeout(()=> {
        if (dataCount == 0) {
          this.knownEntityList = entityList;
          done();
        }
      }, 3 * 1000);
      this.testData.existingEntityIds.forEach((id: string)=> {
        this.svc.get(id).then((value: T)=>{
          dataCount--;
          entityList.push(value);
        })
      });
    });
  }

  private testList(tag: string, verificationFn?: ((data: T, index: number) => void), oldData?: T[]) {
    if (this.testData.noSupportForApiList) {
      return;
    }
    it(Utils.format('List for service {0}, tag:{1}', this.svcConstr["name"], tag), (done)=> {
      let expectedCount = null;
      if (this.entitiesCreated) {
        expectedCount = this.testData.create.length;
      } else if (this.knownEntityList) {
        expectedCount = this.knownEntityList.length;
      } else if (!Utils.nou(this.testData.defaultNumberOfEntities)) {
        expectedCount = this.testData.defaultNumberOfEntities;
      }
      Utils.info("Test Parameters: {0}; knownEntityList: {1}; defaultNumberOfEntities: {2}",
        expectedCount, Utils.stringify(this.knownEntityList), this.testData.defaultNumberOfEntities);
      let svc: ServiceInterface<T> = this.svc;
      svc.list().then((entities: T[]) => {
        this.expectArraysDefinedAndEqual(svc.listCached(), entities);
        this.knownEntityList = entities;
        if (expectedCount !== null) {
          expect(entities.length).toEqual(expectedCount);
        }
        if (verificationFn) {
          entities.forEach((entity: T, index: number)=> {
            verificationFn(entity, index);
          })
        }
        done();
      }).catch((err: any)=> {
        done.fail(err)
      })
    });
  }

  private testDeleteAll(tag?: string) {

    it(Utils.format('Delete All- {0}, for {1}', tag? tag: "", this.svcConstr["name"]), (done: DoneFn)=> {
      let data = this.knownEntityList;
      let remaining = data.length;
      setTimeout(()=> {
        if (remaining == 0) {
          this.knownEntityList = [];
          done();
        }
      }, 3 * 1000);
      let svc: ServiceInterface<T> = this.svc;
      data.forEach((member: T) => {
        svc.delete(svc.getId(member))
          .catch((err: any)=> {
            done.fail(err);
          })
          .then(()=> {
            expect(svc.getCached(svc.getId(member))).toBeUndefined();
            remaining--;
          })
      })
    });
  }

  private testCreateAll() {
    it('Create All-' + this.svcConstr["name"], (done: DoneFn)=> {
      this.knownEntityList = null; // this becomes invalid as we are creating new entities.
      let data = this.testData.create;
      let remaining = data.length;
      setTimeout(()=> {
        if (remaining == 0) {
          done();
          this.entitiesCreated = true;
        }
      }, 3 * 1000);
      let svc: ServiceInterface<T> = this.svc;
      data.forEach((member: T) => {
        svc.create(member)
          .catch((err: any)=> {
            done.fail(err);
          })
          .then((result: T)=>{
            expect(result).toBeDefined();
            expect(svc.getCached(svc.getId(result))).toBeDefined();
            remaining--;
          })
      })
    });
  }

  private testUpdate() {

    it('Update All-' + this.svcConstr["name"], (done: DoneFn)=> {
      let data: T[] = this.knownEntityList;
      let updateFn = this.testData.updateConfig.update;
      let verifyFn = this.testData.updateConfig.verify || ((data: T, index: number)=>{});
      let remaining = data.length;
      setTimeout(()=> {
        if (remaining == 0) {
          done();
        }
      }, 3 * 1000);
      let svc: ServiceInterface<T> = this.svc;
      data.forEach((member: T, index: number) => {
        if (updateFn(member, index)) {
          svc.update(member)
            .catch((err: any)=> {
              done.fail(err);
            })
            .then((value: T) => {
              remaining--;
              verifyFn(value, index);
              verifyFn(svc.getCached(svc.getId(value)), index);
            })
        } else {
          remaining--;
        }
      })
    });
  }

  private setupBeforeAndAfterEach() {
    beforeEach((done: DoneFn)=> {
      this.beforeEach(done);
    });

    afterEach(() => {
      this.afterEach();
    });
  }

  private expectArraysDefinedAndEqual(arr1: Array<T>, arr2: Array<T>) {
    expect(arr1).toBeDefined();
    expect(arr2).toBeDefined();
    let set1: Set<T> = new Set(arr1);
    let set2: Set<T> = new Set(arr2);
    expect(set1.size).toEqual(set2.size);
    set1.forEach((value: T)=>{
      expect(set2.has(value)).toEqual(true);
    })
  }

  private testServiceInjectable() {
    it('Service Injectable:' + this.svcConstr.name, (done)=>{
      inject([this.svcConstr], (svc: ServiceInterface<T>) => {
        this.svc = svc;
        done();
      })();
    })
  }
}
