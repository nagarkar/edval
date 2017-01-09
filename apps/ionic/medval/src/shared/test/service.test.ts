import {AccessTokenService} from "../aws/access.token.service";
import {inject} from "@angular/core/testing";
import {TestUtils} from "../../test";
import {RevvolveApp} from "../../app/app.component";
import {ServiceInterface} from "../service/interface.service";
import {Config} from "../config";
import {AbstractService} from "../service/abstract.service";
import {Utils} from "../stuff/utils";

export interface TestData<T> {
  defaultNumberOfEntities?:number;
  create?: T[];
  updateConfig?: {
    update: (entity: T, index: number)=> boolean; // Return true if
    verify?: (entity: T, index: number)=> void;
  }
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

  constructor(private svcConstr: Function, private testData?: TestData<T>) {

    this.setupBeforeAndAfterEach();

    if (!svcConstr) {
      return;
    }

    this.testList('initial list');
    if (testData && testData.create && testData.create.length > 0) {
      // Always delete everything before creating.
      this.testDeleteAll();
      this.testList('after delete');
      this.testCreateAll();
      this.testList('after create');
    }
    if (testData && testData.updateConfig) {
      this.testUpdate();
      this.testList('after update');
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
      tokenSvc.startNewSession(ServiceTest.creds.username, ServiceTest.creds.password, (result, err) => {
        ServiceTest.authResult = result;
        if (!done) {
          return;
        }
        if (result) {
          done();
        } else {
          done.fail(err);
        }
      })
    })();
  }

  afterEach(done?: DoneFn) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = this.originalTimeout;
    if (done) {
      done();
    }
  }

  private testList(tag: string, verificationFn?: ((data: T, index: number) => void), oldData?: T[]) {
    it(Utils.format('List for service {0}, tag:{1}', this.svcConstr["name"], tag), (done)=> {
      let expectedCount = null;
      if (this.knownEntityList) {
        expectedCount = this.knownEntityList.length;
      } else if (this.testData.create) {
        expectedCount = this.testData.create.length;
      } else if (this.testData.defaultNumberOfEntities) {
        expectedCount = this.testData.defaultNumberOfEntities;
      }
      Utils.log("Test Parameters: {0}; knownEntityList: {1}; defaultNumberOfEntities: {2}",
        expectedCount, Utils.stringify(this.knownEntityList), this.testData.defaultNumberOfEntities);
      inject([this.svcConstr], (svc) => {
        svc.list().then((entities: T[]) => {
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
      })();
    });
  }

  private testDeleteAll() {

    it('Delete All-' + this.svcConstr["name"], (done: DoneFn)=> {
      let data = this.knownEntityList;
      let doneCount = 0;
      setTimeout(()=> {
        if (doneCount == data.length) {
          this.knownEntityList = [];
          done();
        }
      }, 3 * 1000);
      inject([this.svcConstr], (svc: ServiceInterface<T>) => {
        data.forEach((member: T) => {
          svc.delete(svc.getId(member))
            .catch((err: any)=> {
              done.fail(err);
            })
            .then(()=> {
              doneCount++;
            })
        })
      })();
    });
  }

  private testCreateAll() {
    it('Create All-' + this.svcConstr["name"], (done: DoneFn)=> {
      this.knownEntityList = null; // this becomes invalid as we are creating new entities.
      let data = this.testData.create;
      let doneCount = 0;
      setTimeout(()=> {
        if (doneCount == data.length) {
          done();
        }
      }, 3 * 1000);
      inject([this.svcConstr], (svc: ServiceInterface<T>) => {
        data.forEach((member: T) => {
          svc.create(member)
            .catch((err: any)=> {
              done.fail(err);
            })
            .then(()=>{
              doneCount++;
            })
        })
      })();
    });
  }

  private testUpdate() {

    it('Update All-' + this.svcConstr["name"], (done: DoneFn)=> {
      let data: T[] = this.knownEntityList;
      let updateFn = this.testData.updateConfig.update;
      let verifyFn = this.testData.updateConfig.verify || ((data: T, index: number)=>{});
      let doneCount = 0;
      setTimeout(()=> {
        if (doneCount == data.length) {
          done();
        }
      }, 3 * 1000);
      inject([this.svcConstr], (svc: ServiceInterface<T>) => {
        data.forEach((member: T, index: number) => {
          if (updateFn(member, index)) {
            svc.update(member)
              .catch((err: any)=> {
                done.fail(err);
              })
              .then((value: T) => {
                doneCount++;
                verifyFn(value, index);
              })
          } else {
            doneCount++;
          }
        })
      })();
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

}
