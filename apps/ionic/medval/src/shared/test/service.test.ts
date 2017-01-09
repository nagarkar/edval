import {AccessTokenService} from "../aws/access.token.service";
import {inject} from "@angular/core/testing";
import {TestUtils} from "../../test";
import {RevvolveApp} from "../../app/app.component";
import {ServiceInterface} from "../service/interface.service";
import {Utils} from "../stuff/utils";

export interface TestData<T> {
  create?: T[];
  updateConfig?: {
    update: (entity: T, index: number)=> boolean; // Return true if
    verify?: (entity: T, index: number)=> void;
  }
}

export class ServiceTest <T> {

  static authResult = null;
  static creds = {
    username: 'celeron',
    password: 'passWord@1'
  }

  originalTimeout;
  svc: ServiceInterface<T>;
  private lastListedEntities: T[];

  constructor(private svcConstr: Function, private testData?: TestData<T>) {

    this.setupBeforeAndAfterEach();

    if (!svcConstr) {
      return;
    }

    this.testList();
    this.testDeleteAll();
    this.testList(0 /* Expected Count after delete */);
    if (testData && testData.create) {
      this.testCreateAll();
      this.testList(this.testData.create.length /* Expected Count */);
    }
    if (testData && testData.updateConfig) {
      this.testUpdate();
      this.testList(this.testData.create.length /* Expected Count */);
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

  private testList(expectedCount?: number, verificationFn?: ((data: T, index: number) => void), oldData?: T[]) {
    it(Utils.format('List, expectedCount: {0}, for service {1}', expectedCount, this.svcConstr["name"]), (done)=> {
      inject([this.svcConstr], (svc) => {
        svc.list().then((entities: T[]) => {
          if (!this.lastListedEntities) {
            this.lastListedEntities = entities;
          }
          if (expectedCount) {
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
      let data = this.lastListedEntities;
      let doneCount = 0;
      setTimeout(()=> {
        if (doneCount == data.length) {
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
      let data: T[] = this.testData.create;
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
